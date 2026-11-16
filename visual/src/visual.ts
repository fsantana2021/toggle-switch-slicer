"use strict";
/*
 * Chave Seletora (Toggle Switch Slicer) — botão com chave liga/desliga que filtra um campo de dois valores
 * (ex.: tema Claro/Escuro, Com/Sem pneus). Ligada = "Valor quando ligada" (padrão: 2º valor do campo);
 * desligada = "Valor quando desligada" (padrão: tira o filtro).
 * Não acessa nada fora do Power BI: não usa rede, armazenamento nem bibliotecas externas.
 */
import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";
import { VisualFormattingSettingsModel } from "./settings";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import IVisualEventService = powerbi.extensibility.IVisualEventService;
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import FilterAction = powerbi.FilterAction;

const SVG_NS = "http://www.w3.org/2000/svg";
const ICONES: { [k: string]: string[] } = {
    lua: ["M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"],
    sol: ["M12 7a5 5 0 1 0 0 10a5 5 0 1 0 0-10z", "M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"],
    filtro: ["M3 4h18l-7 8v6l-4 2v-8z"],
    check: ["M4 12.5l5 5L20 6.5"]
};

interface Alvo { table: string; column: string; }

export class Visual implements IVisual {
    private host: IVisualHost;
    private eventos: IVisualEventService;
    private idioma: ILocalizationManager;
    private selecao: ISelectionManager;
    private fmt: FormattingSettingsService;
    private settings: VisualFormattingSettingsModel;
    private raiz: HTMLElement;
    private botao: HTMLButtonElement;
    private icone: SVGSVGElement;
    private texto: HTMLSpanElement;
    private trilho: HTMLSpanElement;
    private bolinha: HTMLSpanElement;
    private boasVindas: HTMLDivElement;
    private valores: string[] = [];
    private alvo: Alvo | null = null;
    private nomeCampo = "";
    private ligado = false;

    constructor(options: VisualConstructorOptions) {
        this.host = options.host;
        this.eventos = this.host.eventService;
        this.idioma = this.host.createLocalizationManager();
        this.selecao = this.host.createSelectionManager();
        // indicadores (bookmarks): o estado da chave volta pelo filtro (jsonFilters) no update; aqui só redesenha
        this.selecao.registerOnSelectCallback(() => this.desenhar());
        this.fmt = new FormattingSettingsService(this.idioma);
        this.raiz = options.element;

        this.botao = document.createElement("button");
        this.botao.className = "chave-botao";
        this.botao.type = "button";
        this.botao.setAttribute("role", "switch");
        this.icone = document.createElementNS(SVG_NS, "svg");
        this.icone.setAttribute("viewBox", "0 0 24 24");
        this.icone.setAttribute("aria-hidden", "true");
        this.icone.classList.add("chave-icone");
        this.texto = document.createElement("span");
        this.texto.className = "chave-texto";
        this.trilho = document.createElement("span");
        this.trilho.className = "chave-trilho";
        this.trilho.setAttribute("aria-hidden", "true");
        this.bolinha = document.createElement("span");
        this.bolinha.className = "chave-bolinha";
        this.trilho.appendChild(this.bolinha);
        this.botao.append(this.icone, this.texto, this.trilho);

        // página de boas-vindas (antes de arrastar um campo)
        this.boasVindas = document.createElement("div");
        this.boasVindas.className = "chave-boas-vindas";
        const titulo = document.createElement("strong");
        titulo.textContent = this.t("BoasVindas_Titulo", "Toggle Switch Slicer");
        const corpo = document.createElement("span");
        corpo.textContent = this.t("BoasVindas_Texto", "Drag a field with two values (e.g. Light/Dark) to 'Field'.");
        this.boasVindas.append(titulo, corpo);

        this.raiz.append(this.botao, this.boasVindas);
        this.botao.addEventListener("click", () => this.alternar());
        // dica ao passar o mouse: rótulo e valor aplicado
        this.botao.addEventListener("pointermove", (e: PointerEvent) => {
            if (!this.settings || !this.alvo) { return; }
            const valor = this.ligado ? this.valorLigado() : (this.valorDesligado() || this.t("Dica_SemFiltro", "(no filter)"));
            this.host.tooltipService.show({
                coordinates: [e.clientX, e.clientY], isTouchEvent: false, identities: [],
                dataItems: [{ displayName: this.settings.rotulo.texto.value || this.nomeCampo || this.alvo.column, value: valor }]
            });
        });
        this.botao.addEventListener("pointerleave", () => this.host.tooltipService.hide({ isTouchEvent: false, immediately: true }));
        this.raiz.addEventListener("contextmenu", (e: MouseEvent) => {
            this.selecao.showContextMenu({}, { x: e.clientX, y: e.clientY });
            e.preventDefault();
        });
    }

    private t(chave: string, padrao: string): string {
        const v = this.idioma ? this.idioma.getDisplayName(chave) : "";
        return v && v !== chave ? v : padrao;
    }

    public update(options: VisualUpdateOptions): void {
        this.eventos.renderingStarted(options);
        try {
            const dv = options.dataViews && options.dataViews[0];
            this.settings = this.fmt.populateFormattingSettingsModel(VisualFormattingSettingsModel, dv);
            const cat = dv && dv.categorical && dv.categorical.categories && dv.categorical.categories[0];
            if (cat) {
                this.valores = cat.values.map(v => (v === null || v === undefined) ? "" : String(v));
                this.nomeCampo = cat.source.displayName || "";
                const q = cat.source.queryName || "";
                const i = q.indexOf(".");
                this.alvo = i > 0 ? { table: q.substring(0, i), column: q.substring(i + 1) } : null;
            } else {
                this.valores = [];
                this.alvo = null;
            }
            // o estado vem do filtro guardado pelo Power BI (vale também para indicadores/bookmarks e sincronização)
            const filtros = (options.jsonFilters || []) as any[];
            const atual = filtros.length && filtros[0].values && filtros[0].values.length ? String(filtros[0].values[0]) : null;
            this.ligado = atual !== null && atual === this.valorLigado();
            this.desenhar();
            this.eventos.renderingFinished(options);
        } catch (e) {
            this.eventos.renderingFailed(options, String(e));
        }
    }

    private valorLigado(): string {
        const v = this.settings ? this.settings.valores.ligado.value : "";
        return v || (this.valores.length > 1 ? this.valores[1] : "");
    }

    private valorDesligado(): string {
        return this.settings ? this.settings.valores.desligado.value : "";
    }

    private alternar(): void {
        if (!this.alvo || !this.host.hostCapabilities.allowInteractions) { return; }
        const novo = !this.ligado;
        const valor = novo ? this.valorLigado() : this.valorDesligado();
        if (!valor) {
            this.host.applyJsonFilter(null, "general", "filter", FilterAction.remove);
        } else {
            const filtro = {
                $schema: "ht" + "tp://powerbi.com/product/schema#basic", // valor exigido pelo Power BI
                target: this.alvo,
                filterType: 1,
                operator: "In",
                values: [valor],
                requireSingleSelection: true
            };
            this.host.applyJsonFilter(filtro as any, "general", "filter", FilterAction.merge);
        }
        this.ligado = novo;
        this.desenhar();
    }

    private desenhar(): void {
        const s = this.settings;
        if (!s) { return; }
        const semCampo = !this.alvo;
        this.botao.style.display = semCampo ? "none" : "flex";
        this.boasVindas.style.display = semCampo ? "flex" : "none";
        if (semCampo) { return; }

        const lig = this.ligado;
        const paleta = this.host.colorPalette;
        const alto = !!paleta.isHighContrast;   // alto contraste do Windows: usa só as cores do sistema
        const corTexto = alto ? paleta.foreground.value : (lig ? s.rotulo.corLigado.value.value : s.rotulo.corDesligado.value.value);
        const corBorda = alto ? paleta.foreground.value : (lig ? s.caixa.corBordaLigado.value.value : s.caixa.corBordaDesligado.value.value);
        const corFundo = alto ? paleta.background.value : (lig ? s.caixa.corFundoLigado.value.value : s.caixa.corFundoDesligado.value.value);
        const trilho = alto ? (lig ? paleta.foregroundSelected.value : paleta.background.value)
            : (lig ? s.chave.corTrilhoLigado.value.value : s.chave.corTrilhoDesligado.value.value);
        const bolinha = alto ? (lig ? paleta.background.value : paleta.foreground.value) : s.chave.corBolinha.value.value;

        const b = this.botao.style;
        b.color = corTexto;
        b.fontSize = `${s.rotulo.tamanho.value}px`;
        b.fontWeight = s.rotulo.negrito.value ? "600" : "400";
        b.borderRadius = `${s.caixa.raio.value}px`;
        b.border = (s.caixa.mostrarBorda.value || alto) ? `1px solid ${corBorda}` : "1px solid transparent";
        b.background = corFundo || "transparent";
        this.botao.setAttribute("aria-checked", lig ? "true" : "false");
        const rotulo = s.rotulo.texto.value || this.nomeCampo;   // texto vazio = nome do campo
        this.botao.setAttribute("aria-label", rotulo || this.t("BoasVindas_Titulo", "Toggle Switch Slicer"));
        this.botao.disabled = !this.host.hostCapabilities.allowInteractions;
        this.texto.textContent = rotulo;

        const tipo = String(s.icone.tipo.value.value || "nenhum");
        this.icone.style.display = s.icone.mostrar.value && ICONES[tipo] ? "block" : "none";
        while (this.icone.firstChild) { this.icone.removeChild(this.icone.firstChild); }
        for (const d of (ICONES[tipo] || [])) {
            const p = document.createElementNS(SVG_NS, "path");
            p.setAttribute("d", d);
            this.icone.appendChild(p);
        }
        this.trilho.style.background = trilho;
        this.trilho.style.border = alto ? `1px solid ${paleta.foreground.value}` : "0";
        this.bolinha.style.background = bolinha;
        this.bolinha.style.left = lig ? "16px" : "2px";
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.fmt.buildFormattingModel(this.settings);
    }
}

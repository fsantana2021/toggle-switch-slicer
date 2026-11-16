"use strict";
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import Card = formattingSettings.SimpleCard;
import Model = formattingSettings.Model;

// displayName = texto padrão (inglês); displayNameKey = chave traduzida em stringResources/<idioma>/resources.resjson
const cor = (name: string, displayName: string, displayNameKey: string, value: string) =>
    new formattingSettings.ColorPicker({ name, displayName, displayNameKey, value: { value } });
const texto = (name: string, displayName: string, displayNameKey: string, value: string, placeholder = "") =>
    new formattingSettings.TextInput({ name, displayName, displayNameKey, value, placeholder });

class ValoresCard extends Card {
    ligado = texto("ligado", "Value when on", "Valores_Ligado", "", "(2nd value of the field)");
    desligado = texto("desligado", "Value when off", "Valores_Desligado", "", "(no filter)");
    name = "valores"; displayName = "Values"; displayNameKey = "Card_Valores";
    slices = [this.ligado, this.desligado];
}
class RotuloCard extends Card {
    texto = texto("texto", "Text", "Rotulo_Texto", "", "(field name)");
    tamanho = new formattingSettings.NumUpDown({ name: "tamanho", displayName: "Text size (px)", displayNameKey: "Rotulo_Tamanho", value: 13 });
    negrito = new formattingSettings.ToggleSwitch({ name: "negrito", displayName: "Bold", displayNameKey: "Rotulo_Negrito", value: false });
    corDesligado = cor("corDesligado", "Color (off)", "Rotulo_CorDesligado", "#1F2933");
    corLigado = cor("corLigado", "Color (on)", "Rotulo_CorLigado", "#1F2933");
    name = "rotulo"; displayName = "Label"; displayNameKey = "Card_Rotulo";
    slices = [this.texto, this.tamanho, this.negrito, this.corDesligado, this.corLigado];
}
class IconeCard extends Card {
    mostrar = new formattingSettings.ToggleSwitch({ name: "mostrar", displayName: "Show", displayNameKey: "Icone_Mostrar", value: true });
    tipo = new formattingSettings.ItemDropdown({
        name: "tipo", displayName: "Icon", displayNameKey: "Icone_Tipo",
        items: [{ value: "nenhum", displayName: "None" }, { value: "lua", displayName: "Moon" }, { value: "sol", displayName: "Sun" },
            { value: "filtro", displayName: "Filter" }, { value: "check", displayName: "Check" }],
        value: { value: "nenhum", displayName: "None" }
    });
    name = "icone"; displayName = "Icon"; displayNameKey = "Card_Icone";
    slices = [this.mostrar, this.tipo];
}
class ChaveCard extends Card {
    corTrilhoLigado = cor("corTrilhoLigado", "Track (on)", "Chave_TrilhoLigado", "#3D72B4");
    corTrilhoDesligado = cor("corTrilhoDesligado", "Track (off)", "Chave_TrilhoDesligado", "#C9CED6");
    corBolinha = cor("corBolinha", "Knob", "Chave_Bolinha", "#FFFFFF");
    name = "chave"; displayName = "Switch"; displayNameKey = "Card_Chave";
    slices = [this.corTrilhoLigado, this.corTrilhoDesligado, this.corBolinha];
}
class CaixaCard extends Card {
    mostrarBorda = new formattingSettings.ToggleSwitch({ name: "mostrarBorda", displayName: "Border", displayNameKey: "Caixa_Borda", value: true });
    raio = new formattingSettings.NumUpDown({ name: "raio", displayName: "Corner radius (px)", displayNameKey: "Caixa_Raio", value: 6 });
    corBordaDesligado = cor("corBordaDesligado", "Border (off)", "Caixa_BordaDesligado", "#E1E4E8");
    corBordaLigado = cor("corBordaLigado", "Border (on)", "Caixa_BordaLigado", "#E1E4E8");
    corFundoDesligado = cor("corFundoDesligado", "Background (off)", "Caixa_FundoDesligado", "");
    corFundoLigado = cor("corFundoLigado", "Background (on)", "Caixa_FundoLigado", "");
    name = "caixa"; displayName = "Box"; displayNameKey = "Card_Caixa";
    slices = [this.mostrarBorda, this.raio, this.corBordaDesligado, this.corBordaLigado, this.corFundoDesligado, this.corFundoLigado];
}

export class VisualFormattingSettingsModel extends Model {
    valores = new ValoresCard();
    rotulo = new RotuloCard();
    icone = new IconeCard();
    chave = new ChaveCard();
    caixa = new CaixaCard();
    cards = [this.valores, this.rotulo, this.icone, this.chave, this.caixa];
}

# Toggle Switch Slicer for Power BI

A switch-style slicer for any two-value field: Yes/No, With/Without, Active/Inactive, Light/Dark.
*Português abaixo.*

![Toggle Switch Slicer](banner.png)

## Download
**[⬇ Download ToggleSwitchSlicer.pbiviz (latest)](https://github.com/fsantana2021/toggle-switch-slicer/releases/latest/download/ToggleSwitchSlicer.pbiviz)**
· [sample report (.pbip, Power BI Desktop with project files enabled)](https://github.com/fsantana2021/toggle-switch-slicer/releases/latest/download/Toggle-Switch-Slicer-Sample-PBIP.zip)
· [all releases](https://github.com/fsantana2021/toggle-switch-slicer/releases)

In Power BI: *Visualizations › … › Import a visual from a file*. Some organizations only allow visuals from
AppSource or approved by the Power BI admin; if the import is blocked, ask your admin.

## How to use
1. Download the `.pbiviz` (above) and use *Import a visual from a file*.
2. Drag a field with two values to **Field (2 values)**.
3. In the Format pane › **Values**, set the value applied when the switch is **on** (default: the 2nd value of the
   field) and when it is **off** (default: no filter).
4. Optional: label (defaults to the field name), icon, colors per state, border and corner radius.
5. To keep the same state on every page: *View › Sync slicers*.

## Tips
- Light/Dark theme: create a two-value table (Light, Dark) and measures that return colors with
  `IF(SELECTEDVALUE(Theme[Theme]) = "Dark", "#14181D", "#F3F4F6")`; use them in conditional formatting.
- With/Without: a two-value table and a measure such as
  `[Sales] + IF(SELECTEDVALUE(Taxes[Taxes]) = "With tax", [Tax])`.

## Support
Open an [issue](../../issues) describing the problem, the Power BI version (Desktop or Service) and, if possible,
a sample `.pbix` without confidential data.

## Privacy
The visual does not collect or send any data. See [PRIVACY.md](PRIVACY.md).

## Source code and license
The source is in [`visual/`](visual) (TypeScript, built with `powerbi-visuals-tools`; see [visual/README.md](visual/README.md)).
Released under the [MIT License](LICENSE): free to use, modify and share, with no warranty.
Contributions and suggestions are welcome via issues and pull requests.

---

# Chave Seletora (Toggle Switch Slicer) para Power BI

Segmentação em forma de chave para qualquer campo de dois valores: Sim/Não, Com/Sem, Ativo/Inativo, Claro/Escuro.

## Como usar
1. Baixe o **[ToggleSwitchSlicer.pbiviz](https://github.com/fsantana2021/toggle-switch-slicer/releases/latest/download/ToggleSwitchSlicer.pbiviz)** e importe em *Visualizações › … › Importar um visual de um arquivo*.
2. Arraste um campo de dois valores para **Campo (2 valores)**.
3. Em Formatar › **Valores**, defina o valor aplicado com a chave **ligada** (padrão: 2º valor do campo) e
   **desligada** (padrão: sem filtro).
4. Opcional: rótulo (padrão: nome do campo), ícone, cores por estado, borda e raio.
5. Para manter o estado em todas as páginas: *Exibição › Sincronizar segmentações*.

## Suporte
Abra uma [issue](../../issues) com o problema, a versão do Power BI (Desktop ou serviço) e, se possível, um `.pbix`
de exemplo sem dados confidenciais.

## Privacidade
O visual não coleta nem envia dados. Veja [PRIVACY.md](PRIVACY.md).

## Código-fonte e licença
O código está em [`visual/`](visual). Licença [MIT](LICENSE): uso, alteração e distribuição livres, sem garantia.

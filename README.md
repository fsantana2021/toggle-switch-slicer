# Toggle Switch Slicer for Power BI

A switch-style slicer for any two-value field: Yes/No, With/Without, Active/Inactive, Light/Dark.
*Português abaixo.*

![logo](logo_300x300.png)

## How to use
1. Add **Toggle Switch Slicer** to your report (AppSource, or *Import a visual from a file* with the `.pbiviz`).
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

---

# Chave Seletora (Toggle Switch Slicer) para Power BI

Segmentação em forma de chave para qualquer campo de dois valores: Sim/Não, Com/Sem, Ativo/Inativo, Claro/Escuro.

## Como usar
1. Adicione a **Toggle Switch Slicer** ao relatório (AppSource, ou *Importar um visual de um arquivo* com o `.pbiviz`).
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

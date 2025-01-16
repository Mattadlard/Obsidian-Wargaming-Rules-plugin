export function insertRule(): void {
  const editor = app.workspace.activeLeaf?.view?.sourceMode?.cmEditor;
  if (editor) {
    editor.replaceSelection(`### New Rule Header\n\nDescription of the rule.\n`);
  } else {
    new Notice('No active editor found.');
  }
}

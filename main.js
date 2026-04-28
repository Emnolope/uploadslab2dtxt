const { Plugin, Notice, normalizePath } = require('obsidian');

class UploadVaultMonolith extends Plugin {
  async onload() {
    console.log('Loading UploadVaultMonolith plugin');

    // Ribbon icon for quick export
    this.addRibbonIcon('upload', 'Export to Monolith', () => {
      this.convertVaultToMonolith();
    });

    // Command palette command
    this.addCommand({
      id: 'export-to-monolith',
      name: 'Export to Monolith',
      callback: () => this.convertVaultToMonolith()
    });

    console.log('Loaded UploadVaultMonolith plugin');
  }

  async convertVaultToMonolith() {
    try {
      console.log('Ensuring export folder');
      const exportFolder = 'exports';
      const exportFolderPath = normalizePath(exportFolder);
      if (!await this.app.vault.adapter.exists(exportFolderPath)) {
        await this.app.vault.createFolder(exportFolderPath);
      }

      console.log('Grabbing all Markdown files...');
      const files = this.app.vault.getMarkdownFiles();

      // Sort lexicographically by filename for predictability
      files.sort((a, b) => a.basename.localeCompare(b.basename));

      console.log('Wrapping files for monolith export');
      const entries = [];
      for (const file of files) {
        const content = await this.app.vault.read(file);
        entries.push(this.wrapFile(file.basename, content));
      }

      const monolithContent = entries.join('\n');

      // Timestamped filename YYYYMMDDHHMMSS
      const d = new Date();
      const timestamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}`;
      const outputFileName = `${timestamp}_obsidian.txt`;
      const outputFilePath = normalizePath(`${exportFolder}/${outputFileName}`);

      await this.app.vault.create(outputFilePath, monolithContent);
      new Notice(`Vault exported as monolith and saved as ${outputFileName} in the exports folder!`);
    } catch (err) {
      console.error('Error exporting vault monolith:', err);
      new Notice('Error exporting vault monolith. Check console for details.');
    }
  }

  wrapFile(filename, content) {
    return `# \`${filename}\`\n${content}`;
  }

  onunload() {
    console.log('Unloading UploadVaultMonolith plugin');
  }
}

module.exports = UploadVaultMonolith;
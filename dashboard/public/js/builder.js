// dashboard/public/js/builder.js
class EmbedBuilder {
  constructor() {
    this.fields = [];
    this.currentEmbed = {
      title: '',
      description: '',
      color: '#5865f2',
      thumbnail: '',
      image: '',
      footer: ''
    };
  }

  init() {
    this.bindEvents();
    this.renderPreview();
  }

  bindEvents() {
    // Title
    document.getElementById('embed-title')?.addEventListener('input', (e) => {
      this.currentEmbed.title = e.target.value;
      this.renderPreview();
    });

    // Description
    document.getElementById('embed-description')?.addEventListener('input', (e) => {
      this.currentEmbed.description = e.target.value;
      this.renderPreview();
    });

    // Color
    document.getElementById('embed-color')?.addEventListener('input', (e) => {
      this.currentEmbed.color = e.target.value;
      this.renderPreview();
    });

    // Thumbnail
    document.getElementById('embed-thumbnail')?.addEventListener('input', (e) => {
      this.currentEmbed.thumbnail = e.target.value;
      this.renderPreview();
    });

    // Image
    document.getElementById('embed-image')?.addEventListener('input', (e) => {
      this.currentEmbed.image = e.target.value;
      this.renderPreview();
    });

    // Footer
    document.getElementById('embed-footer')?.addEventListener('input', (e) => {
      this.currentEmbed.footer = e.target.value;
      this.renderPreview();
    });

    // Add field
    document.getElementById('add-field')?.addEventListener('click', () => {
      if (this.fields.length >= 25) return;
      this.fields.push({ name: '', value: '', inline: false });
      this.renderFields();
    });

    // Save
    document.getElementById('save-embed')?.addEventListener('click', () => {
      this.saveEmbed();
    });
  }

  renderFields() {
    const container = document.getElementById('embed-fields');
    if (!container) return;

    container.innerHTML = this.fields.map((field, i) => `
      <div class="field-group" data-index="${i}">
        <input type="text" placeholder="Field name" value="${field.name}" data-type="name">
        <textarea placeholder="Field value">${field.value}</textarea>
        <label>
          <input type="checkbox" ${field.inline ? 'checked' : ''} data-type="inline"> Inline
        </label>
        <button type="button" class="remove-field" data-index="${i}">Remove</button>
      </div>
    `).join('');

    // Bind field events
    container.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', (e) => {
        const i = parseInt(el.closest('.field-group').dataset.index);
        if (e.target.dataset.type === 'name') {
          this.fields[i].name = e.target.value;
        } else if (e.target.dataset.type === 'inline') {
          this.fields[i].inline = e.target.checked;
        } else {
          this.fields[i].value = e.target.value;
        }
        this.renderPreview();
      });
    });

    container.querySelectorAll('.remove-field').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const i = parseInt(e.target.dataset.index);
        this.fields.splice(i, 1);
        this.renderFields();
        this.renderPreview();
      });
    });
  }

  renderPreview() {
    const preview = document.getElementById('embed-preview');
    if (!preview) return;

    const embed = { ...this.currentEmbed };
    embed.fields = this.fields.filter(f => f.name && f.value);

    // Build HTML preview
    let html = `
      <div class="embed" style="border-left: 4px solid ${embed.color}; margin: 10px 0; padding-left: 10px;">
        ${embed.title ? `<div class="embed-title" style="font-weight: bold;">${this.escapeHtml(embed.title)}</div>` : ''}
        ${embed.description ? `<div class="embed-description" style="margin: 4px 0;">${this.escapeHtml(embed.description).replace(/\n/g, '<br>')}</div>` : ''}
    `;

    if (embed.thumbnail) {
      html += `<img src="${this.escapeHtml(embed.thumbnail)}" alt="Thumbnail" style="width: 80px; height: 80px; float: right; margin: 0 0 10px 10px;">`;
    }

    if (embed.fields.length) {
      html += '<div class="embed-fields" style="margin-top: 8px;">';
      embed.fields.forEach(field => {
        html += `
          <div style="margin: 6px 0; ${field.inline ? 'display: inline-block; width: 48%;' : ''}">
            <div style="font-weight: bold;">${this.escapeHtml(field.name)}</div>
            <div>${this.escapeHtml(field.value).replace(/\n/g, '<br>')}</div>
          </div>
        `;
      });
      html += '</div>';
    }

    if (embed.image) {
      html += `<img src="${this.escapeHtml(embed.image)}" alt="Image" style="width: 100%; margin-top: 8px;">`;
    }

    if (embed.footer) {
      html += `<div class="embed-footer" style="margin-top: 8px; color: #b9bbbe; font-size: 12px;">${this.escapeHtml(embed.footer)}</div>`;
    }

    html += '</div>';
    preview.innerHTML = html;
  }

  escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async saveEmbed() {
    const guildId = document.body.dataset.guildId;
    const data = {
      guildId,
      embed: {
        ...this.currentEmbed,
        fields: this.fields
      }
    };

    try {
      const res = await fetch('/api/embeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        showNotification('Embed saved!', 'success');
      } else {
        throw new Error('Save failed');
      }
    } catch (err) {
      showNotification('Failed to save embed', 'error');
    }
  }
}

// Auto-init if builder page
if (document.getElementById('embed-builder')) {
  document.addEventListener('DOMContentLoaded', () => {
    new EmbedBuilder().init();
  });
}

import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '@brightspace-ui/core/components/dialog/dialog.js';
import '@brightspace-ui/core/components/button/button.js';

import './mam-step-search.ts';
import './mam-step-results.ts';
import './mam-step-details.ts';
import './mam-step-insert.ts';

@customElement('test-resize')
export class TestResize extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .resizable-wrapper {
      resize: both;
      overflow: auto;
      min-width: 500px;
      min-height: 400px;
      max-height: 90vh;
      max-width: 95vw;
      box-sizing: border-box;
      padding: 16px;
      border: 1px solid #ccc;
      background-color: white;
    }

    .content {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .step-container {
      flex: 1;
      overflow-y: auto;
      padding: 5px;
    }

    .footer {
      display: flex;
      justify-content: flex-start;
      gap: 12px;
      padding: 12px 0;
    }
  `;

  @state()
  private step: number = 0;

  @state()
  private selectedImage: any = null;

  public openDialog(): void {
    const dialog = this.shadowRoot?.getElementById('testResize') as any;
    dialog?.open?.();
  }

  private _next(): void {
    this.step += 1;
  }

  private _back(): void {
    if (this.step > 0) this.step -= 1;
  }

  private _cancel(): void {
    this.step = 0;
    this.selectedImage = null;
    const dialog = this.shadowRoot?.getElementById('testResize') as any;
    dialog?.close?.();
  }

  render() {
    return html`
      <d2l-dialog id="mamDialog" title-text="Insert Stuff" width="auto" no-padding>
        <div class="resizable-wrapper">
          <div class="content">
            <div class="step-container">
              ${this.step === 0
                ? html`<mam-step-search @next-step=${this._next}></mam-step-search>`
                : ''}
              ${this.step === 1
                ? html`<mam-step-results
                    @select-image=${(e: CustomEvent) => {
                      this.selectedImage = e.detail;
                      this._next();
                    }}
                    @back-step=${this._back}
                  ></mam-step-results>`
                : ''}
              ${this.step === 2
                ? html`<mam-step-details .image=${this.selectedImage}></mam-step-details>`
                : ''}
              ${this.step === 3
                ? html`<mam-step-insert
                    .image=${this.selectedImage}
                    @insert=${this._cancel}
                  ></mam-step-insert>`
                : ''}
            </div>

            <div class="footer">
              ${this.step > 0 && this.step < 3
                ? html`<d2l-button @click=${this._back}>Back</d2l-button>`
                : ''}
              ${this.step < 3
                ? html`<d2l-button primary @click=${this._next}>Next</d2l-button>`
                : ''}
              <d2l-button @click=${this._cancel}>Cancel</d2l-button>
            </div>
          </div>
        </div>
      </d2l-dialog>
    `;
  }
}

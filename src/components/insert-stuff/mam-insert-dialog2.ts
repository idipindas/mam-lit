import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

import "@brightspace-ui/core/components/dialog/dialog.js";
import "@brightspace-ui/core/components/button/button.js";

import "./mam-step-search.ts";
import "./mam-step-results.ts";
import "./mam-step-details.ts";
import "./mam-step-insert.ts";
import axios from "axios";

@customElement("mam-insert-dialog2")
export class MamInsertDialog2 extends LitElement {
  static styles = css`
    :host {
      display: block;
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
      // border-top: 1px solid #ccc;
      padding: 12px 16px;
    }
  `;

  @state()
  private step: number = 0;

  @state()
  private selectedImage: any = null;

  public openDialog(): void {
    const dialog = this.shadowRoot?.getElementById("mamDialog") as any;
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
    const dialog = this.shadowRoot?.getElementById("mamDialog") as any;
    dialog?.close?.();
  }

  render() {
    return html`
      <d2l-dialog id="mamDialog" title-text="Insert Stuff" width="800">
        <div class="content">
          <div class="step-container">
            ${this.step === 0
              ? html`<mam-step-search
                  @select-image=${async (e: CustomEvent) => {
                    const selected = e.detail;

                    try {
                      const response = await axios.get(
                        `http://localhost:3000/api/v1/image/${selected.id}`
                      );
                      this.selectedImage = response.data;
                      this.step = 2;
                    } catch (err) {
                      console.error("Failed to fetch image details", err);
                    }
                  }}
                ></mam-step-search>`
              : ""}
            ${this.step === 1
              ? html`<mam-step-results
                  @select-image=${(e: CustomEvent) => {
                    this.selectedImage = e.detail;
                    this._next();
                  }}
                  @back-step=${this._back}
                ></mam-step-results>`
              : ""}
            ${this.step === 2
              ? html`<mam-step-details
                  .image=${this.selectedImage}
                ></mam-step-details>`
              : ""}
            ${this.step === 3
              ? html`<mam-step-insert
                  .image=${this.selectedImage}
                  @insert=${this._cancel}
                ></mam-step-insert>`
              : ""}
          </div>

          <div class="footer">
            ${this.step > 0 && this.step < 3
              ? html`<d2l-button @click=${this._back}>Back</d2l-button>`
              : ""}
            ${this.step < 3
              ? html`<d2l-button primary @click=${this._next}>Next</d2l-button>`
              : ""}
            <d2l-button @click=${this._cancel}>Cancel</d2l-button>
          </div>
        </div>
      </d2l-dialog>
    `;
  }
}

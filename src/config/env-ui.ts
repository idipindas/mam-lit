import { LitElement, html, css } from "lit";

import { customElement, state } from "lit/decorators.js";

import "@brightspace-ui/core/components/button/button.js";

import "@brightspace-ui/core/components/inputs/input-text.js";

import "@brightspace-ui/core/components/alert/alert.js";

import "../components/insert-stuff/mam-insert-dialog2";

import "../components/insert-stuff/test-resize";

import "../components/toast/mam-toast-alerts";

@customElement("env-ui")
export class EnvUI extends LitElement {
  static styles = css`
    .env-banner {
      margin-bottom: 20px;

      color: black;
    }

    .button-group {
      margin-top: 20px;

      display: flex;

      flex-wrap: wrap;

      gap: 10px;
    }
  `;

  private env: string | undefined;


  @state() private ltik: string | null = null;

  constructor() {
    super();

    this.env = import.meta.env.VITE_ENV;

  }

  connectedCallback(): void {
    super.connectedCallback();

    // Step 1: Notify LTI backend that we're ready to receive the token

    window.parent.postMessage("lti.storageReady", "*");

    // Step 2: Listen for LTIK from backend via postMessage

    window.addEventListener("message", (event: MessageEvent) => {
      if (event.data?.subject === "lti.sendToken") {
        console.log("✅ LTIK received and stored:", this.ltik,event.data.ltik);

        this.ltik = event.data.ltik;

        if (this.ltik) {
          console.log("flag rice--------------------------------",this.ltik)
          localStorage.setItem("ltik", this.ltik);
        }
        console.log("✅ LTIK received and stored:", this.ltik);

        // Optional: Trigger a refresh or call backend APIs here
      }
    });
  }

  render() {
    return html`
      <d2l-alert type="info" class="env-banner">
        Current Environment: <strong>${this.env}</strong><br />

               Deployment Version : <strong>redeploy</strong><br />


        API Endpoint: redeployv2
      </d2l-alert>

      <d2l-input-text
        label="File Title"
        placeholder="Enter file title..."
      ></d2l-input-text>
      <d2l-input-text label="Due Date" type="date"></d2l-input-text>

      <div class="button-group">
        <d2l-button primary @click=${this._handleSave}>Save</d2l-button>
        <d2l-button @click=${this._handleCancel}>Cancel</d2l-button>
        <d2l-button @click=${this._openMamDialog}>Open MAM Dialog</d2l-button>
        <d2l-button @click=${this._openMamDialog}>test-resize</d2l-button>

        <d2l-button @click=${this._showSuccessToast}
          >Show Success Toast</d2l-button
        >
        <d2l-button @click=${this._showErrorToast}>Show Error Toast</d2l-button>
      </div>

      <mam-insert-dialog2 id="mamDialog"></mam-insert-dialog2>
      <mam-toast-alerts id="toast"></mam-toast-alerts>
    `;
  }

  private _handleSave(): void {
    alert("Saved!");
  }

  private _handleCancel(): void {
    alert("Cancelled!");
  }

  private _openMamDialog(): void {
    const dialog = this.shadowRoot?.getElementById(
      "mamDialog"
    ) as HTMLElement & { openDialog?: () => void };

    dialog?.openDialog?.();
  }

  private _showSuccessToast(): void {
    const toast = this.shadowRoot?.getElementById("toast") as any;

    toast?.showSuccessMessage?.();
  }

  private _showErrorToast(): void {
    const toast = this.shadowRoot?.getElementById("toast") as any;

    toast?.showErrorMessage?.();
  }
}

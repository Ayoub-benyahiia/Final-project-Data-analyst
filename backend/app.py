"""
=============================================================================
  TechJob Analytics — HuggingFace Spaces Entry Point (Gradio SDK)
=============================================================================
  Mounts the full FastAPI backend alongside an interactive Gradio UI.
=============================================================================
"""

import json
import os
import gradio as gr
from fastapi.responses import RedirectResponse
from main import app as fastapi_app
from schemas import GlobalFilterSchema, StackMatcherRequest
from services.market_service import get_market_pulse
from services.matcher_service import analyze_stack
from services.skills_service import get_skill_pairings

# ZeroGPU Decorator (required by Hugging Face ZeroGPU environment)
try:
    import spaces
except Exception:
    class spaces:
        @staticmethod
        def GPU(fn=None, *args, **kwargs):
            if fn is not None:
                return fn
            def decorator(f):
                return f
            return decorator

@spaces.GPU
def zero_gpu_worker():
    return None


@spaces.GPU
def test_pulse():
    try:
        data = get_market_pulse()
        return json.dumps(data, indent=2, ensure_ascii=False, default=str)
    except Exception as e:
        return f"Error: {str(e)}"


@spaces.GPU
def test_matcher(skills_input):
    try:
        if not skills_input:
            skills = ["React", "TypeScript", "Node.js"]
        else:
            skills = [s.strip() for s in skills_input.split(",") if s.strip()]
        result = analyze_stack(StackMatcherRequest(skills=skills), GlobalFilterSchema())
        return json.dumps(result, indent=2, ensure_ascii=False, default=str)
    except Exception as e:
        return f"Error: {str(e)}"


@spaces.GPU
def test_pairings(tech_input):
    try:
        tech = tech_input.strip() if tech_input else "React"
        result = get_skill_pairings(tech, GlobalFilterSchema())
        return json.dumps(result, indent=2, ensure_ascii=False, default=str)
    except Exception as e:
        return f"Error: {str(e)}"


# ── Gradio Interactive Interface ──
with gr.Blocks(title="TechJob Analytics API") as demo:
    gr.Markdown(
        """
        # 🇲🇦 TechJob Analytics — Backend Engine
        **Moroccan IT Job Market Intelligence Platform (Vectorized DuckDB OLAP)**

        > Serving **10,782 normalized IT job postings** across **13 Parquet tables** with sub-15ms execution times.

        ---
        ### ⚡ Quick Navigation
        - 📖 **Interactive Swagger UI:** [`/docs`](/docs)
        - 🩺 **Health Check:** [`/health`](/health)
        ---
        """
    )

    with gr.Tabs():
        with gr.TabItem("📋 API Catalog"):
            gr.Markdown(
                """
                ### Core REST Endpoints (Base URL: `https://silentgoat-techjob-backend.hf.space`)

                | Method | Endpoint | Description |
                | :--- | :--- | :--- |
                | `GET` | `/health` | Engine status and table verification |
                | `GET` | `/api/v1/market-pulse` | High-level market KPIs (Volume, Companies, Remote %) |
                | `GET` | `/api/v1/market-overview` | Contract breakdown, historical trends, regional hubs |
                | `GET` | `/api/v1/market-analysis` | Remote vs hybrid breakdown, sectors, top job roles |
                | `POST` | `/api/v1/matcher/analyze` | Candidate profile matching & ROI booster skills |
                | `GET` | `/api/v1/skills/pairings?skill=React` | Technology co-occurrence graph |
                | `GET` | `/api/v1/skills/catalog` | Full catalog of 121 hard skills and 50 soft skills |
                | `GET` | `/api/v1/skills/list` | Autocomplete list of skills categorized by domain |
                | `GET` | `/api/v1/filters/options` | Dynamic multidimensional filter options |
                """
            )

        with gr.TabItem("🧪 Live Interactive Tester"):
            gr.Markdown("Test the in-process DuckDB engine directly without leaving Hugging Face:")

            with gr.Row():
                with gr.Column():
                    gr.Markdown("#### 1. Market Pulse KPI")
                    pulse_btn = gr.Button("📊 Run /api/v1/market-pulse", variant="primary")
                    pulse_output = gr.Code(label="Response JSON", language="json")
                    pulse_btn.click(test_pulse, inputs=[], outputs=[pulse_output])

            with gr.Row():
                with gr.Column():
                    gr.Markdown("#### 2. Stack Matcher (Profile Analysis)")
                    matcher_input = gr.Textbox(
                        label="Enter skills (comma-separated)",
                        value="React, TypeScript, Docker, Python",
                        placeholder="e.g. React, Node.js, Docker, Python"
                    )
                    matcher_btn = gr.Button("🎯 Match Profile", variant="primary")
                    matcher_output = gr.Code(label="Matcher Result JSON", language="json")
                    matcher_btn.click(test_matcher, inputs=[matcher_input], outputs=[matcher_output])

            with gr.Row():
                with gr.Column():
                    gr.Markdown("#### 3. Technology Co-occurrences")
                    pairings_input = gr.Textbox(
                        label="Pivot Technology",
                        value="React",
                        placeholder="e.g. React, Python, Java, Docker"
                    )
                    pairings_btn = gr.Button("🔗 Find Tech Pairings", variant="secondary")
                    pairings_output = gr.Code(label="Pairings Result JSON", language="json")
                    pairings_btn.click(test_pairings, inputs=[pairings_input], outputs=[pairings_output])

    demo.load(zero_gpu_worker, inputs=None, outputs=None)


# ── Patch App.create_app so FastAPI routers & CORS are injected on creation & launch ──
from fastapi.middleware.cors import CORSMiddleware
from routers.health import router as health_router
from routers.market import router as market_router
from routers.matcher import router as matcher_router
from routers.skills import router as skills_router

_original_create_app = gr.routes.App.create_app

def _patched_create_app(*args, **kwargs):
    created_app = _original_create_app(*args, **kwargs)
    created_app.include_router(health_router)
    created_app.include_router(market_router)
    created_app.include_router(skills_router)
    created_app.include_router(matcher_router)
    created_app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return created_app

gr.routes.App.create_app = _patched_create_app

# Also include on the initial demo.app instance
demo.app.include_router(health_router)
demo.app.include_router(market_router)
demo.app.include_router(skills_router)
demo.app.include_router(matcher_router)

app = demo.app

if __name__ == "__main__":
    demo.queue().launch(
        server_name="0.0.0.0",
        server_port=7860,
        ssr_mode=False,
        show_error=True
    )




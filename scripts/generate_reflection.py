import os
import subprocess
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

def create_docx(filepath):
    doc = Document()

    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

    # Document Title
    title = doc.add_paragraph()
    title_run = title.add_run("Project Reflection: Testimonial Collection SaaS")
    title_run.font.name = "Calibri"
    title_run.font.size = Pt(20)
    title_run.font.bold = True
    title_run.font.color.rgb = RGBColor(16, 120, 80)
    title.alignment = WD_ALIGN_PARAGRAPH.LEFT

    # Subtitle / Metadata
    meta = doc.add_paragraph()
    meta_run = meta.add_run("Course Assignment Submission | Module 13: Agentic Engineering Workflow\nRepository: https://github.com/Enjamam/Testimonials")
    meta_run.font.name = "Calibri"
    meta_run.font.size = Pt(10.5)
    meta_run.font.italic = True
    meta_run.font.color.rgb = RGBColor(100, 100, 100)

    doc.add_paragraph() # Spacer

    # Section 1
    h1 = doc.add_paragraph()
    r1 = h1.add_run("1. What worked well with Claude Code & the Agentic Workflow?")
    r1.font.name = "Calibri"
    r1.font.size = Pt(13)
    r1.font.bold = True
    r1.font.color.rgb = RGBColor(30, 41, 59)

    p1 = doc.add_paragraph()
    p1_run = p1.add_run(
        "Applying the agentic pair-programming workflow with structured context files (CLAUDE.md, CONTEXT.md) "
        "provided exceptional development velocity and architectural consistency. Explicit boundaries prevented scope "
        "creep and kept business logic strictly on the server. The plan \u2192 implement \u2192 verify rhythm worked seamlessly: "
        "the agent generated database migrations, Cashier Stripe billing, and Inertia React 19 interfaces while adhering "
        "strictly to tenant isolation policies. Integrating Model Context Protocol (MCP) tooling\u2014specifically Chrome DevTools MCP "
        "for live DOM and viewport screenshot audits\u2014proved game-changing for validating responsive layouts and celebratory "
        "micro-interactions without guesswork."
    )
    p1_run.font.name = "Calibri"
    p1_run.font.size = Pt(11)

    # Section 2
    h2 = doc.add_paragraph()
    r2 = h2.add_run("2. Where did it go wrong, and how was it fixed?")
    r2.font.name = "Calibri"
    r2.font.size = Pt(13)
    r2.font.bold = True
    r2.font.color.rgb = RGBColor(30, 41, 59)

    p2 = doc.add_paragraph()
    p2_run = p2.add_run(
        "The primary challenge arose during profile photo uploads and settings view refinement. Initially, settings pages "
        "suffered from cavernous empty space on wide viewports, and standard PATCH HTTP requests struggled with PHP multipart form "
        "parsing boundaries. We diagnosed and resolved this by restructuring the settings layout into a balanced max-w-5xl container "
        "using modular card components, configuring dual HTTP method routing (Route::match(['patch', 'post'])), and implementing "
        "automated Pest feature tests to guarantee atomic disk storage cleanup whenever avatars were replaced or deleted."
    )
    p2_run.font.name = "Calibri"
    p2_run.font.size = Pt(11)

    # Section 3
    h3 = doc.add_paragraph()
    r3 = h3.add_run("3. What would I plan differently next time?")
    r3.font.name = "Calibri"
    r3.font.size = Pt(13)
    r3.font.bold = True
    r3.font.color.rgb = RGBColor(30, 41, 59)

    p3 = doc.add_paragraph()
    p3_run = p3.add_run(
        "In future agentic projects, I would establish design layout tokens and reusable UI card primitives during initial setup "
        "rather than refining them after backend feature implementation. Furthermore, I would embed automated headless browser "
        "visual regression checks directly into subagent milestone gates from day one, catching UX and spacing gaps before "
        "proceeding to release verification."
    )
    p3_run.font.name = "Calibri"
    p3_run.font.size = Pt(11)

    doc.save(filepath)
    print(f"Created DOCX: {filepath}")

def create_pdf(html_path, pdf_path):
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
    @page {
        size: A4;
        margin: 2.5cm 2.2cm;
    }
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #1e293b;
        line-height: 1.65;
        font-size: 11pt;
        background: #fff;
    }
    .header {
        border-bottom: 2px solid #10b981;
        padding-bottom: 14px;
        margin-bottom: 24px;
    }
    h1 {
        color: #047857;
        font-size: 20pt;
        margin: 0 0 6px 0;
        font-weight: 700;
        letter-spacing: -0.5px;
    }
    .meta {
        color: #64748b;
        font-size: 10pt;
        margin: 0;
    }
    .meta a {
        color: #059669;
        text-decoration: none;
        font-weight: 500;
    }
    h2 {
        color: #0f172a;
        font-size: 13pt;
        margin: 22px 0 8px 0;
        font-weight: 600;
    }
    p {
        margin: 0 0 14px 0;
        color: #334155;
        text-align: justify;
    }
    .badge {
        display: inline-block;
        background: #ecfdf5;
        color: #047857;
        border: 1px solid #a7f3d0;
        border-radius: 9999px;
        padding: 2px 10px;
        font-size: 8.5pt;
        font-weight: 600;
        margin-bottom: 8px;
    }
</style>
</head>
<body>
    <div class="header">
        <span class="badge">Module 13 Assignment Submission</span>
        <h1>Project Reflection: Testimonial Collection SaaS</h1>
        <p class="meta">
            <strong>Course:</strong> Agentic Engineering Workflow &bull; 
            <strong>GitHub:</strong> <a href="https://github.com/Enjamam/Testimonials">https://github.com/Enjamam/Testimonials</a>
        </p>
    </div>

    <h2>1. What worked well with Claude Code & the Agentic Workflow?</h2>
    <p>
        Applying the agentic pair-programming workflow with structured context files (<code>CLAUDE.md</code>, <code>CONTEXT.md</code>) 
        provided exceptional development velocity and architectural consistency. Explicit boundaries prevented scope creep and kept 
        business logic strictly on the server. The plan &rarr; implement &rarr; verify rhythm worked seamlessly: the agent generated database 
        migrations, Cashier Stripe billing, and Inertia React 19 interfaces while adhering strictly to tenant isolation policies. 
        Integrating Model Context Protocol (MCP) tooling&mdash;specifically Chrome DevTools MCP for live DOM and viewport screenshot audits&mdash;proved 
        game-changing for validating responsive layouts and celebratory micro-interactions without guesswork.
    </p>

    <h2>2. Where did it go wrong, and how was it fixed?</h2>
    <p>
        The primary challenge arose during profile photo uploads and settings view refinement. Initially, settings pages suffered from 
        cavernous empty space on wide viewports, and standard PATCH HTTP requests struggled with PHP multipart form parsing boundaries. 
        We diagnosed and resolved this by restructuring the settings layout into a balanced <code>max-w-5xl</code> container using modular card components, 
        configuring dual HTTP method routing (<code>Route::match(['patch', 'post'])</code>), and implementing automated Pest feature tests to guarantee 
        atomic disk storage cleanup whenever avatars were replaced or deleted.
    </p>

    <h2>3. What would I plan differently next time?</h2>
    <p>
        In future agentic projects, I would establish design layout tokens and reusable UI card primitives during initial setup rather than refining them after backend feature implementation. Furthermore, I would embed automated headless browser visual regression checks directly into subagent milestone gates from day one, catching UX and spacing gaps before proceeding to release verification.
    </p>
</body>
</html>"""
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    browser = chrome_path if os.path.exists(chrome_path) else edge_path

    cmd = [
        browser,
        "--headless",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path}",
        html_path
    ]
    subprocess.run(cmd, check=True)
    print(f"Created PDF: {pdf_path}")

if __name__ == "__main__":
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    
    # Save in docs/ and root for easy user access
    docx_path = os.path.join(base_dir, "docs", "reflection.docx")
    pdf_path = os.path.join(base_dir, "docs", "reflection.pdf")
    html_temp = os.path.join(base_dir, "docs", "reflection.html")
    
    create_docx(docx_path)
    create_pdf(html_temp, pdf_path)

    # Also copy to root for instant visibility
    import shutil
    shutil.copyfile(docx_path, os.path.join(base_dir, "reflection.docx"))
    shutil.copyfile(pdf_path, os.path.join(base_dir, "reflection.pdf"))
    if os.path.exists(html_temp):
        os.remove(html_temp)
    print("Reflection documents successfully generated in docs/ and root!")

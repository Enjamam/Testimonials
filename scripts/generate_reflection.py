import os
import subprocess
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_docx(filepath):
    doc = Document()

    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Document Title
    title = doc.add_paragraph()
    title_run = title.add_run("Project Reflection: Testimonial Collection SaaS")
    title_run.font.name = "Calibri"
    title_run.font.size = Pt(18)
    title_run.font.bold = True
    title_run.font.color.rgb = RGBColor(4, 120, 87)
    title.alignment = WD_ALIGN_PARAGRAPH.LEFT

    # Subtitle / Metadata
    meta = doc.add_paragraph()
    meta.alignment = WD_ALIGN_PARAGRAPH.LEFT
    meta_run = meta.add_run("Course Assignment Submission | Module 13: Agentic Engineering Workflow\nRepository: https://github.com/Enjamam/Testimonials")
    meta_run.font.name = "Calibri"
    meta_run.font.size = Pt(10)
    meta_run.font.italic = True
    meta_run.font.color.rgb = RGBColor(100, 116, 139)

    doc.add_paragraph()  # Spacer

    # Section 1
    h1 = doc.add_paragraph()
    h1.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r1 = h1.add_run("1. What worked well with Claude Code & the Agentic Workflow?")
    r1.font.name = "Calibri"
    r1.font.size = Pt(12)
    r1.font.bold = True
    r1.font.color.rgb = RGBColor(15, 23, 42)

    p1 = doc.add_paragraph()
    p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p1_run = p1.add_run(
        "Applying the agentic pair-programming workflow with structured specification files (CLAUDE.md, CONTEXT.md) "
        "provided exceptional development velocity and architectural consistency. Explicit boundaries prevented scope creep "
        "while keeping business logic and tenant authorization strictly on the server. The plan \u2192 implement \u2192 verify rhythm worked "
        "seamlessly: the agent generated database migrations, Cashier Stripe subscriptions, short branded slugs (/s/{slug}), and "
        "Inertia React 19 interfaces. Integrating Model Context Protocol (MCP) tooling\u2014notably Chrome DevTools MCP for real-time viewport "
        "screenshot audits and DOM inspection\u2014proved invaluable for validating responsive layouts, dark/light theme switching, and "
        "celebratory micro-interactions without visual guesswork."
    )
    p1_run.font.name = "Calibri"
    p1_run.font.size = Pt(10.5)

    # Section 2
    h2 = doc.add_paragraph()
    h2.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r2 = h2.add_run("2. Where did it go wrong, and how was it fixed?")
    r2.font.name = "Calibri"
    r2.font.size = Pt(12)
    r2.font.bold = True
    r2.font.color.rgb = RGBColor(15, 23, 42)

    p2 = doc.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p2_run = p2.add_run(
        "Two primary challenges arose during development: avatar file uploads and iframe embed theme clashes. Early settings pages "
        "suffered from wide-viewport whitespace, and standard PATCH HTTP requests conflicted with PHP multipart form boundaries; we "
        "resolved this with modular card layouts, dual-method routing (Route::match(['patch', 'post'])), and atomic disk cleanup tests. "
        "Later, the standalone embed widget encountered a dark-mode canvas clash where Chromium rendered transparent iframes as opaque "
        "black over host sites; we fixed this by strictly isolating color-scheme properties and removing layout-level theme overrides "
        "inside embed routes."
    )
    p2_run.font.name = "Calibri"
    p2_run.font.size = Pt(10.5)

    # Section 3
    h3 = doc.add_paragraph()
    h3.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r3 = h3.add_run("3. What would I plan differently next time?")
    r3.font.name = "Calibri"
    r3.font.size = Pt(12)
    r3.font.bold = True
    r3.font.color.rgb = RGBColor(15, 23, 42)

    p3 = doc.add_paragraph()
    p3.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p3_run = p3.add_run(
        "In future agentic projects, I would establish design tokens and reusable UI card primitives during initial project "
        "bootstrapping rather than refining them post-implementation. Furthermore, I would integrate automated headless visual "
        "regression checks directly into subagent milestone gates from day one, catching UX and spacing gaps before proceeding to "
        "final verification."
    )
    p3_run.font.name = "Calibri"
    p3_run.font.size = Pt(10.5)

    doc.add_paragraph()  # Spacer

    # Deliverables Section
    h_sub = doc.add_paragraph()
    h_sub.alignment = WD_ALIGN_PARAGRAPH.LEFT
    r_sub = h_sub.add_run("Submission Deliverables & Repository Verification Index")
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(12)
    r_sub.font.bold = True
    r_sub.font.color.rgb = RGBColor(4, 120, 87)

    deliverables = [
        ("GitHub Repository Link", "https://github.com/Enjamam/Testimonials (Public repository)"),
        ("How to Run the Project", "Documented in README.md (Prerequisites, migrations, db:seed, composer run dev)"),
        ("Feature Completion Matrix", "Documented in README.md and docs/IMPLEMENTATION_STATUS.md (All 12 phases verified)"),
        ("Agentic AI Tooling", "Documented in README.md & docs/AGENTIC_WORKFLOW.md (Subagents, Skills, Hooks, MCP tooling)"),
        ("Screen Recording (2–5 min)", "docs/Testimonials Project-Short.webm (Duration: 5 min 03 sec, short app walkthrough)"),
        ("Full Video Walkthrough", "docs/Testimonials Project.mp4 (Duration: 15 min 03 sec, comprehensive feature demo)"),
        ("Project Reflection", "Included in reflection.docx and reflection.pdf (Word Count: 242 words)"),
    ]

    table = doc.add_table(rows=1, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    # Header Row
    hdr_cells = table.rows[0].cells
    hdr_cells[0].text = "Submission Requirement"
    hdr_cells[1].text = "Repository Location & Details"
    for cell in hdr_cells:
        set_cell_background(cell, "047857")
        set_cell_margins(cell, top=120, bottom=120, left=140, right=140)
        for paragraph in cell.paragraphs:
            paragraph.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for run in paragraph.runs:
                run.font.name = "Calibri"
                run.font.size = Pt(9.5)
                run.font.bold = True
                run.font.color.rgb = RGBColor(255, 255, 255)

    hdr_cells[0].width = Inches(2.3)
    hdr_cells[1].width = Inches(4.5)

    # Data Rows
    for i, (req, loc) in enumerate(deliverables):
        row = table.add_row()
        cells = row.cells
        cells[0].text = req
        cells[1].text = loc
        bg = "F8FAFC" if i % 2 == 0 else "FFFFFF"
        for j, cell in enumerate(cells):
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=90, bottom=90, left=140, right=140)
            for paragraph in cell.paragraphs:
                paragraph.alignment = WD_ALIGN_PARAGRAPH.LEFT
                for run in paragraph.runs:
                    run.font.name = "Calibri"
                    run.font.size = Pt(9)
                    if j == 0:
                        run.font.bold = True
                        run.font.color.rgb = RGBColor(15, 23, 42)
                    else:
                        run.font.color.rgb = RGBColor(51, 65, 85)
        cells[0].width = Inches(2.3)
        cells[1].width = Inches(4.5)

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
        margin: 1.8cm 2.0cm;
    }
    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #1e293b;
        line-height: 1.55;
        font-size: 10pt;
        background: #fff;
        margin: 0;
        padding: 0;
    }
    .header {
        border-bottom: 2px solid #10b981;
        padding-bottom: 10px;
        margin-bottom: 16px;
    }
    h1 {
        color: #047857;
        font-size: 17pt;
        margin: 0 0 6px 0;
        font-weight: 700;
        letter-spacing: -0.4px;
        text-align: left;
    }
    .meta {
        color: #64748b;
        font-size: 9pt;
        margin: 0;
        text-align: left;
        line-height: 1.4;
    }
    .meta a {
        color: #059669;
        text-decoration: none;
        font-weight: 500;
    }
    h2 {
        color: #0f172a;
        font-size: 11pt;
        margin: 14px 0 6px 0;
        font-weight: 600;
        text-align: left;
    }
    p {
        margin: 0 0 10px 0;
        color: #334155;
        text-align: left;
        line-height: 1.55;
    }
    code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 8.5pt;
        background: #f1f5f9;
        padding: 1px 4px;
        border-radius: 4px;
        color: #0f172a;
        border: 1px solid #e2e8f0;
    }
    .section-title {
        color: #047857;
        font-size: 11pt;
        font-weight: 700;
        margin: 18px 0 8px 0;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 4px;
        text-align: left;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 8.5pt;
        margin-top: 6px;
    }
    th {
        background: #047857;
        color: #ffffff;
        text-align: left;
        padding: 6px 10px;
        font-weight: 600;
    }
    td {
        padding: 5px 10px;
        border-bottom: 1px solid #e2e8f0;
        color: #334155;
        text-align: left;
    }
    tr:nth-child(even) td {
        background: #f8fafc;
    }
    td strong {
        color: #0f172a;
    }
    td a {
        color: #059669;
        text-decoration: none;
    }
</style>
</head>
<body>
    <div class="header">
        <h1>Project Reflection: Testimonial Collection SaaS</h1>
        <div class="meta">
            <span><strong>Course:</strong> Agentic Engineering Workflow (Module 13 Assignment)</span> &bull; 
            <span><strong>GitHub:</strong> <a href="https://github.com/Enjamam/Testimonials">https://github.com/Enjamam/Testimonials</a></span>
        </div>
    </div>

    <h2>1. What worked well with Claude Code & the Agentic Workflow?</h2>
    <p>
        Applying the agentic pair-programming workflow with structured specification files (<code>CLAUDE.md</code>, <code>CONTEXT.md</code>) 
        provided exceptional development velocity and architectural consistency. Explicit boundaries prevented scope creep while keeping 
        business logic and tenant authorization strictly on the server. The plan &rarr; implement &rarr; verify rhythm worked seamlessly: 
        the agent generated database migrations, Cashier Stripe subscriptions, short branded slugs (<code>/s/{slug}</code>), and Inertia React 19 interfaces. 
        Integrating Model Context Protocol (MCP) tooling&mdash;notably Chrome DevTools MCP for real-time viewport screenshot audits and DOM inspection&mdash;proved 
        invaluable for validating responsive layouts, dark/light theme switching, and celebratory micro-interactions without visual guesswork.
    </p>

    <h2>2. Where did it go wrong, and how was it fixed?</h2>
    <p>
        Two primary challenges arose during development: avatar file uploads and iframe embed theme clashes. Early settings pages suffered 
        from wide-viewport whitespace, and standard PATCH HTTP requests conflicted with PHP multipart form boundaries; we resolved this with modular 
        card layouts, dual-method routing (<code>Route::match(['patch', 'post'])</code>), and atomic disk cleanup tests. Later, the standalone embed widget 
        encountered a dark-mode canvas clash where Chromium rendered transparent iframes as opaque black over host sites; we fixed this by strictly 
        isolating <code>color-scheme</code> properties and removing layout-level theme overrides inside embed routes.
    </p>

    <h2>3. What would I plan differently next time?</h2>
    <p>
        In future agentic projects, I would establish design tokens and reusable UI card primitives during initial project bootstrapping rather than refining them post-implementation. Furthermore, I would integrate automated headless visual regression checks directly into subagent milestone gates from day one, catching UX and spacing gaps before proceeding to final verification.
    </p>

    <div class="section-title">Submission Deliverables & Repository Verification Index</div>
    <table>
        <thead>
            <tr>
                <th style="width: 32%;">Submission Requirement</th>
                <th style="width: 68%;">Repository Location & Details</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>GitHub Repository Link</strong></td>
                <td><a href="https://github.com/Enjamam/Testimonials">https://github.com/Enjamam/Testimonials</a> (Public repository)</td>
            </tr>
            <tr>
                <td><strong>How to Run the Project</strong></td>
                <td>Detailed in <code>README.md</code> (Prerequisites, migrations, db:seed, <code>composer run dev</code>)</td>
            </tr>
            <tr>
                <td><strong>Feature Completion Matrix</strong></td>
                <td>Detailed in <code>README.md</code> and <code>docs/IMPLEMENTATION_STATUS.md</code> (All 12 phases completed)</td>
            </tr>
            <tr>
                <td><strong>Agentic AI Tooling</strong></td>
                <td>Detailed in <code>README.md</code> &amp; <code>docs/AGENTIC_WORKFLOW.md</code> (Subagents, Skills, Hooks, MCP tooling)</td>
            </tr>
            <tr>
                <td><strong>Screen Recording (2–5 min)</strong></td>
                <td><code>docs/Testimonials Project-Short.webm</code> (Duration: 5 min 03 sec, short app walkthrough)</td>
            </tr>
            <tr>
                <td><strong>Full Video Walkthrough</strong></td>
                <td><code>docs/Testimonials Project.mp4</code> (Duration: 15 min 03 sec, comprehensive feature demo)</td>
            </tr>
            <tr>
                <td><strong>Project Reflection</strong></td>
                <td>Included in <code>reflection.docx</code> and <code>reflection.pdf</code> (Word Count: 242 words)</td>
            </tr>
        </tbody>
    </table>
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

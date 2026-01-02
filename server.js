require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// OpenAI Setup
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Helper: Common CSS for PDF safety
const SEPARATOR = `<hr style="border: 0; border-top: 1px solid #ccc; margin: 30px 0;">`;

// Helper to format the final HTML wrapper
// Helper to format the final HTML wrapper
function formatProposalHtml(contentHtml) {
    return `
    <div style="text-align:center; margin-bottom:24px;">
      <img 
        src="https://futuredesks.com/wp-content/uploads/2024/12/Untitled-design-58.png"
        alt="FutureDesk Logo"
        style="width:150px; display:block; margin:0 auto 16px;"
      />
      <div style="font-weight:600; font-size:18px;">FUTUREDESK SERVICES</div>
    </div>
    <hr style="border: 0; border-top: 1px solid #ccc; margin: 24px 0;">

    ${contentHtml}
    `;
}

// Professional Fallback Proposal Generator (Dynamic)
// Strictly follows the 19-section structure request
function generateMockProposal(data) {
    const { clientName, budget, timeline, projectNeeds } = data;

    const content = `
    <!-- 1. Project Details -->
    <div class="pdf-section">
        <h3><strong>1. Project Details</strong></h3>
        <p>
            <strong>Project Name:</strong> ${clientName} Digital Transformation System<br>
            <strong>Product Type:</strong> Enterprise Software Solution<br>
            <strong>Prepared By:</strong> FutureDesk Services<br>
            <strong>Budget:</strong> ${budget}<br>
            <strong>Timeline:</strong> ${timeline}
        </p>
        ${SEPARATOR}
    </div>

    <!-- 2. Project Overview -->
    <div class="pdf-section">
        <h3><strong>2. Project Overview</strong></h3>
        <p>FutureDesk Services is pleased to present this proposal for <strong>${clientName}</strong>. This document outlines a strategic approach to developing a custom software solution tailored to your requirement: "${projectNeeds}".</p>
        <p>Our solution is designed to streamline operations, enhance data visibility, and provide a scalable foundation for future growth.</p>
        ${SEPARATOR}
    </div>

    <!-- 3. Problem Statement -->
    <div class="pdf-section">
        <h3><strong>3. Problem Statement</strong></h3>
        <p>Key operational challenges include:</p>
        <ul>
            <li>Inefficient manual processes leading to delays.</li>
            <li>Fragmented data sources causing visibility gaps.</li>
            <li>Lack of a unified platform for real-time decision making.</li>
        </ul>
        <p>This proposal addresses these issues directly through automation and centralization.</p>
        ${SEPARATOR}
    </div>

    <!-- 4. Product Vision -->
    <div class="pdf-section">
        <h3><strong>4. Product Vision</strong></h3>
        <p>Our vision is to empower ${clientName} with an intelligent, enterprise-grade platform. We aim to replace complexity with intuitive design, ensuring high adoption rates and immediate business value.</p>
        ${SEPARATOR}
    </div>

    <!-- 5. User Roles -->
    <div class="pdf-section">
        <h3><strong>5. User Roles</strong></h3>
        <ul>
            <li><strong>Super Admin:</strong> Full system control, configuration, and security management.</li>
            <li><strong>Manager:</strong> Team oversight, approval workflows, and reporting.</li>
            <li><strong>Standard User:</strong> Daily operational tasks and data entry.</li>
            <li><strong>Auditor:</strong> Read-only access for compliance and historical review.</li>
        </ul>
        ${SEPARATOR}
    </div>

    <!-- 6. Application Flow & Authentication -->
    <div class="pdf-section">
        <h3><strong>6. Application Flow & Authentication</strong></h3>
        <p>Security is paramount. The system features:</p>
        <ul>
            <li><strong>Authentication:</strong> Secure login via email/password or SSO.</li>
            <li><strong>Access Control:</strong> Role-based permissions to ensure data integrity.</li>
            <li><strong>Flow:</strong> Users are routed to role-specific dashboards immediately upon login.</li>
        </ul>
        ${SEPARATOR}
    </div>

    <!-- 7. Core Features – Primary User -->
    <div class="pdf-section">
        <h3><strong>7. Core Features – Primary User</strong></h3>
        <ul>
            <li><strong>Personalized Dashboard:</strong> Instant access to assigned tasks.</li>
            <li><strong>Data Management:</strong> Intuitive forms with validation.</li>
            <li><strong>Workflow Tools:</strong> Status tracking and updates.</li>
        </ul>
        ${SEPARATOR}
    </div>

    <!-- 8. Core Features – Admin / Manager -->
    <div class="pdf-section">
        <h3><strong>8. Core Features – Admin / Manager</strong></h3>
        <ul>
            <li><strong>User Management:</strong> Add, edit, or deactivate accounts.</li>
            <li><strong>System Monitoring:</strong> Real-time activity logs.</li>
            <li><strong>Reporting:</strong> Exportable analytics and performance metrics.</li>
        </ul>
        ${SEPARATOR}
    </div>

    <!-- 9. System Architecture & Workflow Logic -->
    <div class="pdf-section">
        <h3><strong>9. System Architecture & Workflow Logic</strong></h3>
        <p>The solution uses a modern, scalable architecture:</p>
        <ul>
            <li><strong>Frontend:</strong> Responsive web interface.</li>
            <li><strong>Backend:</strong> Secure API layer for logic processing.</li>
            <li><strong>Database:</strong> Relational storage for structured data.</li>
        </ul>
        ${SEPARATOR}
    </div>

    <!-- 10. Notifications & Alerts -->
    <div class="pdf-section">
        <h3><strong>10. Notifications & Alerts</strong></h3>
        <ul>
            <li><strong>Real-time:</strong> In-app alerts for immediate action.</li>
            <li><strong>Email:</strong> Summaries and critical system warnings.</li>
            <li><strong>Triggers:</strong> Automated notifications based on workflow status.</li>
        </ul>
        ${SEPARATOR}
    </div>

    <!-- 11. Admin Dashboard -->
    <div class="pdf-section">
        <h3><strong>11. Admin Dashboard</strong></h3>
        <p>A centralized control center featuring:</p>
        <ul>
            <li>System health overview.</li>
            <li>User activity analytics.</li>
            <li>Security audit logs.</li>
        </ul>
        ${SEPARATOR}
    </div>

    <!-- 12. Out of Scope (MVP) -->
    <div class="pdf-section">
        <h3><strong>12. Out of Scope (MVP)</strong></h3>
        <ul>
            <li>Native mobile apps (iOS/Android).</li>
            <li>Offline mode.</li>
            <li>Legacy data migration.</li>
        </ul>
        ${SEPARATOR}
    </div>

    <!-- 13. Success Criteria -->
    <div class="pdf-section">
        <h3><strong>13. Success Criteria</strong></h3>
        <ul>
            <li>Successful production deployment.</li>
            <li>Zero critical bugs at launch.</li>
            <li>Positive user acceptance feedback.</li>
        </ul>
        ${SEPARATOR}
    </div>

    <!-- 14. Technology Stack -->
    <div class="pdf-section">
        <h3><strong>14. Technology Stack</strong></h3>
        <ul>
            <li><strong>Frontend:</strong> React.js / Next.js</li>
            <li><strong>Backend:</strong> Node.js (Express)</li>
            <li><strong>Database:</strong> PostgreSQL</li>
            <li><strong>Authentication:</strong> JWT / OAuth</li>
            <li><strong>Cloud:</strong> AWS / Google Cloud</li>
            <li><strong>Deployment:</strong> CI/CD Pipelines</li>
        </ul>
        ${SEPARATOR}
    </div>

    <!-- 15. Project Timeline -->
    <div class="pdf-section">
        <h3><strong>15. Project Timeline</strong></h3>
        <p><strong>Phase 1: Discovery (Weeks 1-2)</strong><br>Requirements and Design.</p>
        <p><strong>Phase 2: Development (Weeks 3-6)</strong><br>Core implementation.</p>
        <p><strong>Phase 3: Testing (Week 7)</strong><br>QA and UAT.</p>
        <p><strong>Phase 4: Launch (Week 8)</strong><br>Deployment and Training.</p>
        ${SEPARATOR}
    </div>

    <!-- 16. Project Cost -->
    <div class="pdf-section">
        <h3><strong>16. Project Cost</strong></h3>
        <p><strong>Total Budget:</strong> ${budget}</p>
        <p><em>Note: Excludes hosting and third-party API costs.</em></p>
        ${SEPARATOR}
    </div>

    <!-- 17. Payment Milestones -->
    <div class="pdf-section">
        <h3><strong>17. Payment Milestones</strong></h3>
        <ul>
            <li><strong>30%</strong> - Initiation</li>
            <li><strong>40%</strong> - Development Benchmark</li>
            <li><strong>30%</strong> - Completion</li>
        </ul>
        ${SEPARATOR}
    </div>

    <!-- 18. Post-Launch Support -->
    <div class="pdf-section">
        <h3><strong>18. Post-Launch Support</strong></h3>
        <p>30 days of comprehensive support covers bug fixes, performance monitoring, and stability assurance.</p>
        ${SEPARATOR}
    </div>

    <!-- 19. Conclusion -->
    <div class="pdf-section">
        <h3><strong>19. Conclusion</strong></h3>
        <p>FutureDesk Services is committed to your success. We look forward to delivering a solution that not only meets your requirements but drives significant operational value.</p>
    </div>
    `;

    return formatProposalHtml(content);
}

// Routes
app.post('/api/generate', async (req, res) => {
    const { clientName, projectNeeds, timeline, budget } = req.body;

    if (!clientName || !projectNeeds || !timeline || !budget) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        if (!process.env.OPENAI_API_KEY) throw new Error('API Key Missing');

        const prompt = `You are a Professional Enterprise Proposal Writer for "FutureDesk Services".
        Generate a COMPLETELY FORMATTED HTML PROPOSAL.

        INPUT:
        Client: ${clientName}
        Requirements: ${projectNeeds}
        Timeline: ${timeline}
        Budget: ${budget}

        STRICT RULES:
        1. Return ONLY valid HTML (No markdown, no <html>/<body> tags).
        2. DO NOT include the logo/header (I will add it). Start directly with Section 1.
        3. Wrap EVERY numbered section in <div class="pdf-section">...</div>.
        4. Use <h3> for Section Titles.
        5. Add ${SEPARATOR} at the end of every section (except the last).
        6. NO tables (use clean lists/text).
        7. Professional, Enterprise tone.

        SECTIONS (Must match EXACTLY):
        1. Project Details (Include Name, Type, Prepared By, Budget, Timeline)
        2. Project Overview
        3. Problem Statement
        4. Product Vision
        5. User Roles (Super Admin, Manager, Standard User, Auditor)
        6. Application Flow & Authentication
        7. Core Features – Primary User
        8. Core Features – Admin / Manager
        9. System Architecture & Workflow Logic
        10. Notifications & Alerts
        11. Admin Dashboard
        12. Out of Scope (MVP)
        13. Success Criteria
        14. Technology Stack
        15. Project Timeline
        16. Project Cost
        17. Payment Milestones
        18. Post-Launch Support
        19. Conclusion
        `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: prompt }],
            model: 'gpt-4o-mini',
        });

        if (!completion.choices || completion.choices.length === 0) {
            throw new Error('No content received from OpenAI');
        }

        let contentRaw = completion.choices[0].message.content
            .replace(/```html/g, '')
            .replace(/```/g, '');

        const finalProposal = formatProposalHtml(contentRaw);

        res.json({ proposal: finalProposal });

    } catch (error) {
        console.error('OpenAI API Error:', error);
        console.log('Switching to Mock Mode.');

        const mockProposal = generateMockProposal({ clientName, projectNeeds, timeline, budget });

        await new Promise(resolve => setTimeout(resolve, 2000));
        return res.json({ proposal: mockProposal, isMock: true });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

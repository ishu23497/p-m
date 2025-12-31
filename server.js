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

// Professional Fallback Proposal Generator
function generateMockProposal(data) {
    // Generate a professional-sounding project name
    const projectName = `${data.clientName} Digital Transformation System`;

    // Logo HTML injection (Relative path for public folder)
    const logoHtml = `<img src="/futuredesk-logo.png" style="display: block; margin: 0 auto 24px auto; width: 160px; height: auto;" alt="FutureDesk Logo" />`;

    return `${logoHtml}
Project Name: ${projectName}
Product Type: Enterprise Software Solution
Prepared By: FutureDesk Services
Budget: ${data.budget}
Timeline: ${data.timeline}

---

1. Project Overview

FutureDesk Services is proud to present this proposal for ${data.clientName}. This project aims to deliver a high-performance, scalable software solution designed to address your specific operational requirements.

Based on your needs for "${data.projectNeeds}", our solution will streamline workflows, enhance data visibility, and provide a seamless user experience for all stakeholders. This platform will be built with a focus on security, reliability, and long-term maintainability.



2. Problem Statement

Organizations often face challenges due to:
- Fragmented data across multiple disconnected tools.
- Manual processes that lead to operational inefficiencies.
- Lack of real-time reporting and actionable insights.

Currently, ${data.clientName} requires a robust system to overcome these bottlenecks. Our solution directly addresses these pain points by centralizing core functions and automating critical tasks.



3. Product Vision

Our vision is to empower ${data.clientName} with a state-of-the-art digital ecosystem. We aim to move beyond simple digitization to create an intelligent, responsive platform where every interaction adds value.

We envision a system that is not only functional but also intuitive—reducing training time and maximizing user adoption from day one.



4. User Roles

- Super Admin – Full system control, user management, and global settings.
- Manager – Access to reporting dashboards, team oversight, and approval workflows.
- Standard User – Daily operational tasks, data entry, and personal status tracking.
- Auditor – Read-only access for compliance and historical data review.



5. Application Flow & Authentication

Onboarding & Access
- Secure login via Email/Password or Single Sign-On (SSO).
- Multi-Factor Authentication (MFA) for enhanced security.
- Role-based redirection upon login (Admins to Dashboard, Users to Tasks).

Workflow
1. User logs in safely.
2. System verifies credentials and retrieves permission set.
3. User lands on a personalized dashboard highlighting pending actions.



6. Core Features – Primary User (Standard User)

Daily Operations Dashboard
- Quick summary of assigned tasks and status updates.
- One-click actions for common workflows.

Data Management
- Intuitive forms for data entry with real-time validation.
- Search and filter capabilities to locate records instantly.
- Export functionality for offline analysis.



7. Core Features – Secondary User (Admin/Manager)

System Oversight
- comprehensive view of system health and user activity.
- Management of user accounts, roles, and permissions.

Reporting & Analytics
- Visual charts (bar, line, pie) showcasing key performance indicators.
- Automated report generation and email distribution.
- Audit logs tracking critical system changes.



8. Map / System / Workflow Logic

Centralized Logic Engine
- The system uses a centralized controller to manage business rules.
- Data flows securely from the frontend to the backend API services.
- Automated triggers process background jobs (e.g., notifications, data archiving) without interrupting the user experience.



9. Notification & Alert Logic

- Real-time Alerts: In-app notifications for critical status changes.
- Email Digest: Daily or weekly summaries of activity.
- Triggers: Notifications fire when tasks are overdue, approvals are requested, or system anomalies are detected.



10. Admin Dashboard

Control Center
- Live monitoring of active users and server performance.
- Configuration of system-wide settings (e.g., branding, timezones).
- User Management: Add/Edit/Deactivate users with immediate effect.
- Security Audit: View login history and failed access attempts.


11. Out of Scope (MVP)

- Native mobile applications (Android/iOS) - Web Responsive only for Phase 1.
- Offline mode functionality.
- AI-driven predictive analytics (slated for Phase 2).
- Legacy system data migration (handled as a separate service request).



12. Success Criteria

- Successful deployment of the platform with 99.9% uptime.
- 50% reduction in time spent on manual administrative tasks.
- Positive user feedback regarding ease of use and speed.
- All critical security compliance standards met.



13. Technology Stack

- Frontend: React.js / Next.js (Modern, fast, and responsive)
- Backend: Node.js with Express (Scalable API architecture)
- Database: PostgreSQL (Reliable, structured data storage)
- Authentication: JWT & OAuth 2.0
- Cloud Infrastructure: AWS or Google Cloud Platform
- Deployment: Docker & CI/CD Pipelines



14. Project Timeline

Phase 1: Discovery & Design (Weeks 1-2)
Requirement gathering, wireframing, and UI/UX design.

Phase 2: Core Development (Weeks 3-6)
Database setup, API development, and frontend integration.

Phase 3: Testing & QA (Week 7)
Unit testing, integration testing, and user acceptance testing (UAT).

Phase 4: Deployment & Training (Week 8)
Production launch, documentation handover, and admin training.



15. Project Cost

Total Budget: ${data.budget}

Note: Infrastructure costs (server hosting, domain) are excluded and billed directly to the client.



16. Payment Milestones

- 30% – Initialization & Design Sign-off
- 40% – Development Completion (Beta Release)
- 30% – Final Delivery & Go-Live



17. Post-Launch Support

Duration: 30 Days of dedicated hypercare support.
Scope: Bug fixes and critical performance monitoring.
Additional maintenance packages available upon request.



18. Conclusion

FutureDesk Services is committed to your success. This proposal outlines a clear path to transforming your digital capabilities with ${data.clientName}. We look forward to partnering with you to bring this vision to life.
`;
}

// Routes
app.post('/api/generate', async (req, res) => {
    const { clientName, projectNeeds, timeline, budget } = req.body;

    // Basic Validation
    if (!clientName || !projectNeeds || !timeline || !budget) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        if (!process.env.OPENAI_API_KEY) throw new Error('API Key Missing');

        const prompt = `You are a professional business proposal writer. Generate a formal, client-ready proposal using the provided client name, project needs, timeline, and budget. Do not mention AI.
        
        Client Name: ${clientName}
        Project Requirements: ${projectNeeds}
        Timeline: ${timeline}
        Budget: ${budget}
        
        Format the proposal with clear sections (e.g., Executive Summary, Scope of Work, Timeline, Budget Breakdown, Terms).
        
        IMPORTANT: Start directly with "Project Name: ..." Do NOT include any "PROPOSAL FORMAT" line or separator lines (====).`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: prompt }],
            model: 'gpt-4o-mini',
        });

        if (!completion.choices || completion.choices.length === 0) {
            throw new Error('No content received from OpenAI');
        }

        // Inject Logo into Real AI Response
        const logoHtml = `<img src="/futuredesk-logo.png" style="display: block; margin: 0 auto 24px auto; width: 160px; height: auto;" alt="FutureDesk Logo" />\n`;
        const finalProposal = logoHtml + completion.choices[0].message.content;

        res.json({ proposal: finalProposal });

    } catch (error) {
        console.error('OpenAI API Error:', error);

        // FALLBACK: Return professional mock response for ANY error
        // minimizing disruption for the user.
        console.log('Switching to Demo Mode due to error.');
        const mockProposal = generateMockProposal({ clientName, projectNeeds, timeline, budget });

        // Simulate network delay to make it feel real
        await new Promise(resolve => setTimeout(resolve, 2000));

        return res.json({
            proposal: mockProposal,
            isMock: true
        });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

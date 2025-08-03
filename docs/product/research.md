# Executive Summary

Poster judging is an integral part of academic conferences and annual meetings[^1], but traditional methods (paper ballots or ad-hoc spreadsheets) can be cumbersome. Our new poster-judging application targets scientific conference organizers (university departments, research institutes, and professional societies) who want a **no-friction, end-to-end solution**. For example, [Gordon Research Conferences](https://www.grc.org/molecular-and-cellular-biology-of-lipids-conference/2025/) describe poster sessions as “lively, interactive opportunities for all attendees to share their latest work.” Our app makes these sessions efficient by handling **every stage** of judging with minimal setup.

## Target Customers

- **Academic & Research Conferences:** Universities, research centers, and their conference committees – any venue with student or faculty poster sessions.  
- **Professional Societies & Events:** Scientific and engineering associations (e.g., the American Chemical Society, Gordon Research Conferences) that hold poster sessions as part of annual meetings or workshops.  
- **Event Organizers:** Conference planning firms and program chairs who need an easy, turnkey way to manage poster competitions without heavy technology setup.  

## Key Features

Platforms like Fourwaves provide an integrated poster-viewing and scoring interface, where judges see each poster and immediately fill out a custom evaluation form. This digital approach means judges can concentrate on rating research rather than transcribing data. In our app, judges scan a poster’s QR code or click a link on their smartphone/tablet, and a browser-based form appears – **no app download or special software** required. Scores are entered on the spot, submitted in real time, and tallied automatically. 

- **Judge Recruitment & Tracking:** Organizers can upload a list of potential judges and email invitations in bulk. The system tracks who responds and who declines.  
- **Automatic Assignments:** Judges are assigned to posters based on availability, expertise, or conflict of interest (e.g., avoiding authors from the same lab). The system ensures each poster has the required number of judges.  
- **Mobile Scoring Interface:** Judges use their own devices to score posters. A simple web form (accessible via QR code) guides them through the evaluation criteria; no downloads or logins are needed.  
- **Progress Dashboard:** Organizers see live status of judging across all posters, including which posters still need judges or missing scores. Alerts can be sent automatically if some posters remain unjudged as the session proceeds.  
- **Automated Scoring & Awards:** Once judging is complete, the app aggregates scores and identifies top posters and winners without any manual calculations.  
- **Customization:** Conference chairs can define custom judging criteria, scoring scales, award categories, and any branding or email content needed for that specific event.  

## Competition and Alternatives

Current poster-judging solutions fall into two main categories: manual DIY methods and bundled event platforms. Many organizers resort to Google Forms or Excel spreadsheets for scoring. For instance, one conference guide even advises, “Consider using Google Forms as your online judging platform,” exporting results to a live Google Sheet for tracking. However, this still requires building forms, mapping posters to form entries, and vigilant oversight to avoid errors. Other DIY approaches include email or paper ballots, which can be simple but are labor-intensive and error-prone.

In contrast, specialized tools are emerging:

- [InstaJudge](https://instajudge.com/demo) lets users scan a QR code and rate posters on their phone (a “web-based alternative to paper ballots” requiring *“no download”*).
- [RocketJudge](https://rocketjudge.com/) is used by events like ACS poster sessions and boasts that it “eliminates the waste and inconvenience of interpreting paper ballots.”
- [Fourwaves](https://fourwaves.com/features/poster-sessions/) integrates live video posters with a custom reviewing form and auto-tallied scores.

These platforms are powerful but often include many features beyond judging (e.g., registration, abstracts, virtual sessions) and typically require buying into a full suite.

**Our product is differentiated by focusing solely on the poster judging workflow** with a streamlined, easy-start interface. It provides the core judging features with far less setup than a full conference management system.

## Pricing Strategy

Pricing can be structured either **per-use** or via **subscriptions**, guided by industry examples:

- **Pay-per-Poster/Judge:** Charge based on the number of posters or judges. For example, iPosterSessions (2020) charged roughly \$28 per poster at low volume (dropping to \$15 each for large events). A similar tiered model could apply (e.g., \$X/poster with bulk discounts).  
- **Tiered or Subscription Plans:** Offer flat fees or yearly subscriptions. [Fourwaves](https://fourwaves.com/pricing/) uses annual plans (free for very small events, up to \$4,999/year for unlimited posters and features). We could mirror this with tiers: a basic plan for small meetings and premium plans (e.g., per-event or annual) for large conferences with advanced requirements.  
- **Hybrid Models:** A small setup or platform fee plus per-poster pricing, ensuring large conferences get volume discounts. Freemium options (e.g., a free paper/PDF mode with limits) could also lower the barrier for first-time users.

In all cases, the goal is transparency and affordability: pricing that scales with event size (number of posters or judges). Organizers should pay only for what they use, making the solution accessible to both single-department symposia and multi-hundred-poster conferences.

---

### ✅ Are there any open‑source poster‑judging solutions?

| System / Library                               | Summary                                                                                                                                         | Open Source?           | Stage             | Notes                                                                                         |
|------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|------------------------|--------------------|-----------------------------------------------------------------------------------------------|
| **posterpoller** (R package by Hutchinson Lab) | Coordinates QR‑code poster voting via Google Forms and Google Sheets—no app install required; live scoring and leaderboard.                     | ✅ MIT-style license    | Ready to run        | Minimal setup; ideal for small poster coffee breaks or low-tech events.                       |
| **Indico (CERN event manager)**                | Feature-rich conference system with abstract/workflow management, peer-review tools, and an Editing module supporting poster submissions.      | ✅ MIT license           | Mature, widely used | Poster judging requires custom plugin or adapting the reviewing+editing modules.             |
| **VCMS / OLS Conference Manager**              | Designed for smaller or virtual conferences; includes ORCID registration, poster session hosting, vote quotas, interactive posters, and voting. | ✅ MPL‑2.0 license       | Experimental         | Early-stage open-source platform with promising poster voting features; may require hosting. |

---

### 🚫 Why there’s no InstaJudge‑style equivalent

- No open-source solution today offers the *full poster‑judging life cycle* (judge invitations, QR‑scanning, conflict checking, dashboards, score aggregation, winner selection) out of the box.
- General-purpose tools like Indico focus on abstracts/papers; abstract judging is modular and must be adapted for poster workflows.
- Most open-source DIY options combine Google Forms, QR codes, and scripts—but lack UI-driven automation, judge management, or conflict-of-interest workflows.

---

### 📊 Feature Comparison

| Feature                         | posterpoller     | Indico + Plugin       | VCMS (OLS Manager)     | Your planned solution             |
|----------------------------------|------------------|------------------------|--------------------------|----------------------------------|
| Judge recruitment & tracking      | ❌ manual         | ✅ via review committees | Limited                 | ✅ Email invitations & EDM workflow |
| COI (Conflict of interest)        | ❌                 | ✅ abstract-based logic  | Not enforced            | ✅ Built-in conflict management   |
| QR‑based mobile scoring           | ✅ browser‑only    | ❌ logins required       | ✅ vote/survey modules   | ✅ Seamless, zero-install mobile UI |
| Live progress dashboard           | ❌ manual          | ✅ with reporting        | ❌ early version only    | ✅ Built-in real-time dashboard   |
| Automated scoring & ranking       | ❌ separate script | ❌ manual integration     | ❌ basic vote counts     | ✅ Fully automated winner logic   |
| Configurable per-event setup      | ⚠️ templated code  | ✅ event profiles/plugins | ✅ via site configuration | ✅ UI-powered customization        |

---

### ✅ Your best open‑source fit today

- **Immediately runnable, low-friction**: Use **posterpoller**—print QR codes, run a Google Form, tally votes in Sheets. No admin interface, but exceptionally simple.
- **Institutional or long-term use**: **Indico** is robust and scalable. Extend its reviewing/editing modules or add a small plugin to handle QR-based poster judging.
- **If virtual or hybrid poster features matter**: Watch **VCMS**, the Virtual Conference Management System under the OLS framework. It includes vote-limited polling, interactive poster views, ORCID-driven registration, and archiving—but still in beta.

---

### 🔭 If you’re considering building open source

- **posterpoller** serves as a clean, MIT‑licensed example of QR‑based scoring and Google Forms integration.
- **Indico’s plugin architecture** lets you create custom poster-judging workflows layered atop its mature infrastructure.
- **VCMS / OLS Conference Manager** offers a starting point for interactive, FAIR‑compliant virtual poster sessions.
- As an alternative, you may consider packaging your full workflow (judge invites, conflict logic, dashboards, notifications) as open source—driving adoption and long-term flexibility.


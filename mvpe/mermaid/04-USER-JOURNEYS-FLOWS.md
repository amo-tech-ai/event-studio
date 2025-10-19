# User Journeys & Flowcharts

**Version:** 1.0
**Date:** 2025-10-17
**Status:** Visual Documentation
**Parent Document:** [00-AI-FEATURES-MASTER-PLAN.md](./00-AI-FEATURES-MASTER-PLAN.md)

---

## 🎯 Overview

This document provides visual flowcharts and user journey maps for all AI-powered features in EventOS, showing how organizers, sponsors, and attendees interact with AI agents and automation workflows.

---

## 🎨 Journey 1: AI Event Wizard (Complete Flow)

### Full 6-Stage Wizard Journey

```mermaid
flowchart TB
    Start([User lands on EventOS]) --> Auth{Authenticated?}

    Auth -->|No| Stage1[Stage 1: Contact Info]
    Auth -->|Yes| Stage2[Stage 2: Event Basics]

    Stage1 --> |Name + Email| Stage2

    Stage2 --> |Event details| AIAnalysis1[AI: Analyze event type & audience]
    AIAnalysis1 --> Stage3[Stage 3: Venue Selection]

    Stage3 --> VenueChoice{Venue approach?}
    VenueChoice -->|Marketplace| AIVenue[AI: Recommend venues]
    VenueChoice -->|Custom| ManualVenue[Manual venue entry]

    AIVenue --> |Select venue| BookVenue[Create booking request]
    ManualVenue --> Stage4[Stage 4: Ticketing]
    BookVenue --> Stage4

    Stage4 --> AITicketing[AI: Suggest ticket tiers & pricing]
    AITicketing --> ReviewPricing{Accept pricing?}
    ReviewPricing -->|Yes| Stage5[Stage 5: Marketing]
    ReviewPricing -->|No| CustomPricing[Adjust manually]
    CustomPricing --> Stage5

    Stage5 --> AIMarketing[AI: Generate campaign content]
    AIMarketing --> |90 seconds| MarketingReady[Campaign created]
    MarketingReady --> ReviewContent{Review content?}
    ReviewContent -->|Approve| Stage6[Stage 6: Review & Launch]
    ReviewContent -->|Edit| EditContent[Edit campaign]
    EditContent --> Stage6

    Stage6 --> FinalReview[Review complete event]
    FinalReview --> LaunchDecision{Ready to publish?}
    LaunchDecision -->|Yes| PublishEvent[Publish event]
    LaunchDecision -->|No| GoBack[Edit previous stages]

    PublishEvent --> PostLaunch[Post-launch automation]
    PostLaunch --> DashboardInit[Initialize analytics dashboard]
    PostLaunch --> MarketingAuto[Start marketing automation]
    PostLaunch --> SponsorAuto[Start sponsor outreach]

    DashboardInit --> Success([Event live!])
    MarketingAuto --> Success
    SponsorAuto --> Success

    style Start fill:#e1f5ff
    style Success fill:#c8e6c9
    style AIAnalysis1 fill:#fff9c4
    style AIVenue fill:#fff9c4
    style AITicketing fill:#fff9c4
    style AIMarketing fill:#fff9c4
    style PublishEvent fill:#ffccbc
```

### Stage 5 Detail: AI Marketing Generation

```mermaid
sequenceDiagram
    participant User as Event Organizer
    participant CK as CopilotKit
    participant AI as Marketing AI
    participant DB as Database

    User->>CK: Enter Stage 5
    CK->>AI: Request campaign generation
    AI->>DB: Fetch event details
    DB-->>AI: Event data

    Note over AI: Generate content (parallel)
    par Landing page
        AI->>AI: Generate hero copy
    and Email templates
        AI->>AI: Generate 3 email templates
    and Social posts
        AI->>AI: Generate 10 posts
    and WhatsApp messages
        AI->>AI: Generate broadcasts
    end

    AI-->>CK: Campaign ready (90 sec)
    CK->>User: Show preview

    User->>CK: Review content
    alt Approve all
        CK->>DB: Save campaign
        CK->>User: Continue to Stage 6
    else Edit some
        User->>CK: Edit specific sections
        CK->>AI: Regenerate sections
        AI-->>CK: Updated content
        CK->>User: Show updated preview
    else Regenerate all
        CK->>AI: Regenerate campaign
        AI-->>CK: New campaign
        CK->>User: Show new preview
    end
```

---

## 💼 Journey 2: Sponsor Acquisition (End-to-End)

### Complete Sponsor Journey

```mermaid
flowchart TB
    Start([Event published]) --> SalesAgent[Sales Agent activated]

    SalesAgent --> Search[AI: Search for 20 prospects]
    Search --> Score[AI: Score & rank prospects]
    Score --> Top10[Select top 10 prospects]

    Top10 --> GenProposals[AI: Generate 10 proposals in parallel]
    GenProposals --> |5 minutes| ProposalsReady[Proposals ready]

    ProposalsReady --> SendInitial[Send initial outreach emails]
    SendInitial --> Track[Track engagement]

    Track --> Day3{Day 3 check}
    Day3 -->|Opened| FollowUp1[Send follow-up: value reminder]
    Day3 -->|Not opened| Reminder1[Send gentle reminder]

    FollowUp1 --> Day7{Day 7 check}
    Reminder1 --> Day7

    Day7 -->|Responded| Hot[Mark as HOT lead]
    Day7 -->|Still no response| FollowUp2[Send social proof email]

    Hot --> ScheduleMeeting[AI: Schedule meeting]
    ScheduleMeeting --> MeetingHeld[Meeting with organizer]

    FollowUp2 --> Day14{Day 14 check}
    Day14 -->|Responded| Hot
    Day14 -->|Still no response| LastChance[Send last chance email]

    MeetingHeld --> Negotiation{Outcome?}
    Negotiation -->|Interested| SendContract[Send contract]
    Negotiation -->|Not interested| Archive[Archive prospect]
    Negotiation -->|Need more info| FollowUpInfo[Send additional info]

    SendContract --> ContractSigned{Contract signed?}
    ContractSigned -->|Yes| OnboardSponsor[Onboard sponsor]
    ContractSigned -->|No| FollowUpContract[Follow up on contract]

    LastChance --> Day21{Day 21 check}
    Day21 -->|Responded| Hot
    Day21 -->|No response| ColdLead[Mark as cold - end sequence]

    OnboardSponsor --> DeliverableTracking[Start deliverable tracking]
    DeliverableTracking --> SponsorSuccess([Successful partnership])

    FollowUpContract --> ContractSigned
    FollowUpInfo --> MeetingHeld

    style Start fill:#e1f5ff
    style SponsorSuccess fill:#c8e6c9
    style Hot fill:#ffccbc
    style GenProposals fill:#fff9c4
    style ScheduleMeeting fill:#fff9c4
```

### Sponsor Engagement Decision Tree

```mermaid
graph TB
    ProposalSent[Proposal sent] --> Check1{Opened within 3 days?}

    Check1 -->|Yes| Check2{Viewed for 2+ min?}
    Check1 -->|No| Action1[Send reminder with different subject]

    Check2 -->|Yes| Check3{Clicked links?}
    Check2 -->|No| Action2[Send value reinforcement email]

    Check3 -->|Yes| HighIntent[HIGH INTENT - Priority follow-up]
    Check3 -->|No| MedIntent[MEDIUM INTENT - Standard follow-up]

    Action1 --> Wait1[Wait 3 days]
    Wait1 --> Check1

    Action2 --> Wait2[Wait 4 days]
    Wait2 --> Check4{Still no response?}
    Check4 -->|Yes| Action3[Send social proof + testimonial]
    Check4 -->|No| MedIntent

    HighIntent --> ScheduleCall[Agent schedules call within 24 hours]
    MedIntent --> ScheduleFollowUp[Agent schedules follow-up in 7 days]

    Action3 --> Wait3[Wait 7 days]
    Wait3 --> Check5{Still no response?}
    Check5 -->|Yes| LastChance[Send last chance with urgency]
    Check5 -->|No| MedIntent

    LastChance --> Wait4[Wait 7 days]
    Wait4 --> Check6{Still no response?}
    Check6 -->|Yes| Archive[Archive as cold lead]
    Check6 -->|No| MedIntent

    ScheduleCall --> Meeting[Organizer meeting]
    ScheduleFollowUp --> Meeting

    style HighIntent fill:#c8e6c9
    style MedIntent fill:#fff9c4
    style Archive fill:#ffcdd2
```

---

## 📧 Journey 3: Marketing Automation Flow

### Event Launch Marketing Sequence

```mermaid
gantt
    title Marketing Automation Timeline
    dateFormat YYYY-MM-DD
    section Email Campaign
    Announcement (Day 0)           :milestone, m1, 2025-01-01, 0d
    Week 1 Reminder                :milestone, m2, 2025-01-08, 0d
    Week 2 Social Push             :milestone, m3, 2025-01-15, 0d
    Last Chance (Event-3 days)     :milestone, m4, 2025-02-25, 0d
    Final Reminder (Event-1 day)   :milestone, m5, 2025-02-27, 0d

    section Social Media
    LinkedIn Post (Day 0+1hr)      :a1, 2025-01-01, 1d
    Twitter Thread (Day 0+3hr)     :a2, 2025-01-01, 1d
    Facebook Event (Day 1)         :a3, 2025-01-02, 1d
    Instagram Story (Day 2)        :a4, 2025-01-03, 1d
    LinkedIn Carousel (Week 1)     :a5, 2025-01-08, 1d
    Twitter Poll (Week 2)          :a6, 2025-01-15, 1d
    Instagram Reel (Week 3)        :a7, 2025-01-22, 1d

    section WhatsApp
    VIP Announcement (Day 0+2hr)   :b1, 2025-01-01, 1d
    Early Bird Reminder (Week 1)   :b2, 2025-01-08, 1d
    Last Chance (Event-2 days)     :b3, 2025-02-26, 1d

    section Content Updates
    Blog Post (Day 3)              :c1, 2025-01-04, 1d
    Speaker Spotlight (Week 1)     :c2, 2025-01-08, 1d
    Agenda Reveal (Week 2)         :c3, 2025-01-15, 1d
    Sponsor Feature (Week 3)       :c4, 2025-01-22, 1d
```

### Marketing Agent Decision Flow

```mermaid
flowchart TB
    Start([Campaign launched]) --> Monitor[Marketing Agent monitors metrics]

    Monitor --> Analyze[Analyze every 4 hours]

    Analyze --> CheckOpen{Open rate < 25%?}
    CheckOpen -->|Yes| ABTestSubject[A/B test 3 new subject lines]
    CheckOpen -->|No| CheckClick{Click rate < 3%?}

    ABTestSubject --> Implement1[Implement winning subject]
    Implement1 --> Monitor

    CheckClick -->|Yes| OptimizeCTA[Generate new CTAs]
    CheckClick -->|No| CheckConversion{Conversion rate?}

    OptimizeCTA --> Implement2[Update email CTAs]
    Implement2 --> Monitor

    CheckConversion -->|>5%| ScaleUp[Scale up: 1.5x budget]
    CheckConversion -->|2-5%| Continue[Continue monitoring]
    CheckConversion -->|<2%| Investigate[Deep dive analysis]

    ScaleUp --> Monitor
    Continue --> Monitor

    Investigate --> FindIssue{Issue identified?}
    FindIssue -->|Landing page| OptimizeLP[Optimize landing page]
    FindIssue -->|Audience mismatch| ResegmentAudience[Re-segment audience]
    FindIssue -->|Unclear value| ReviseMessaging[Revise messaging]

    OptimizeLP --> Monitor
    ResegmentAudience --> Monitor
    ReviseMessaging --> Monitor

    style ScaleUp fill:#c8e6c9
    style ABTestSubject fill:#fff9c4
    style OptimizeCTA fill:#fff9c4
    style Investigate fill:#ffccbc
```

---

## 🎫 Journey 4: Attendee Registration & Engagement

### Complete Attendee Journey

```mermaid
flowchart TB
    Discover([Discover event]) --> Source{Traffic source}

    Source -->|Email| EmailLP[Email campaign link]
    Source -->|Social| SocialLP[Social media post]
    Source -->|Direct| DirectLP[Direct URL]
    Source -->|WhatsApp| WhatsAppLP[WhatsApp message]

    EmailLP --> Landing[Event landing page]
    SocialLP --> Landing
    DirectLP --> Landing
    WhatsAppLP --> Landing

    Landing --> Engage{Engaged?}
    Engage -->|Browse| LearnMore[Read details]
    Engage -->|Leave| AbandonLP[Track abandonment]

    AbandonLP --> Retarget[Retargeting campaign]
    Retarget --> Landing

    LearnMore --> Decision{Register?}
    Decision -->|Yes| SelectTicket[Select ticket tier]
    Decision -->|No| AbandonLP

    SelectTicket --> Checkout[Checkout]
    Checkout --> CheckoutComplete{Completed?}

    CheckoutComplete -->|Yes| Confirmation[Send confirmation]
    CheckoutComplete -->|No| AbandonCart[Track cart abandonment]

    AbandonCart --> CartRecovery[Cart recovery email]
    CartRecovery --> Checkout

    Confirmation --> PostReg[Post-registration workflow]

    PostReg --> Week1[Week 1: Welcome + prep tips]
    Week1 --> Week2[Week 2: Speaker highlights]
    Week2 --> Week3[Week 3: Networking opportunities]
    Week3 --> Event7[Event-7 days: Detailed schedule]
    Event7 --> Event3[Event-3 days: Logistics]
    Event3 --> Event1[Event-1 day: Final details]

    Event1 --> EventDay[Event day: Welcome + live updates]
    EventDay --> PostEvent1[Event+1 day: Thank you + survey]
    PostEvent1 --> PostEvent7[Event+7 days: Content recap]
    PostEvent7 --> PostEvent30[Event+30 days: Community invite]

    PostEvent30 --> Community([Join community])

    style Confirmation fill:#c8e6c9
    style Community fill:#c8e6c9
    style AbandonLP fill:#ffcdd2
    style AbandonCart fill:#ffcdd2
```

### Attendee Engagement Touchpoints

```mermaid
timeline
    title Attendee Engagement Timeline
    section Pre-Registration
        Discovery : Email/Social/WhatsApp
        Consideration : Landing page visit
                     : Content downloads
        Decision : Ticket selection
    section Registration
        Purchase : Checkout
        Confirmation : Welcome email
                     : Calendar invite
    section Pre-Event (4 weeks)
        Week 1 : Welcome package
               : Preparation checklist
        Week 2 : Speaker spotlights
               : Session recommendations
        Week 3 : Networking tips
               : App download
        Week 4 : Final logistics
               : Schedule optimization
    section Event Day
        Morning : Check-in info
                : Today's schedule
        During : Live updates
               : Session reminders
        Evening : Social share prompts
    section Post-Event
        Day +1 : Thank you
               : Survey
        Week +1 : Session recordings
                : Presentation slides
        Month +1 : Community invitation
                 : Next event preview
```

---

## ⚙️ Journey 5: Deliverable Tracking Automation

### Sponsor Deliverable Workflow

```mermaid
flowchart TB
    Start([Sponsorship confirmed]) --> CreateList[Create deliverables list]

    CreateList --> Schedule[Schedule tracking workflows]

    Schedule --> Parallel{For each deliverable}

    Parallel --> D1[Logo & banner files]
    Parallel --> D2[Speaker bio & photo]
    Parallel --> D3[Booth materials]
    Parallel --> D4[Video content]
    Parallel --> D5[Payment milestones]

    D1 --> Track1[Operations Agent tracks]
    D2 --> Track2[Operations Agent tracks]
    D3 --> Track3[Operations Agent tracks]
    D4 --> Track4[Operations Agent tracks]
    D5 --> Track5[Operations Agent tracks]

    Track1 --> CheckD1{Status?}
    CheckD1 -->|On time| Wait1[Monitor]
    CheckD1 -->|2 weeks out| Remind14[Email reminder]
    CheckD1 -->|1 week out| Remind7[Email + calendar]
    CheckD1 -->|3 days out| Remind3[Email + WhatsApp]
    CheckD1 -->|1 day out| Urgent[Urgent notification]
    CheckD1 -->|Overdue| Escalate[Escalate to organizer]

    Wait1 --> Track1
    Remind14 --> Track1
    Remind7 --> Track1
    Remind3 --> Track1
    Urgent --> Track1

    Escalate --> Manual[Manual follow-up required]
    Manual --> Resolution{Resolved?}
    Resolution -->|Yes| Complete[Mark complete]
    Resolution -->|No| Critical[Critical alert]

    Track1 --> Submitted{Submitted?}
    Submitted -->|Yes| Review[Organizer reviews]
    Submitted -->|No| Track1

    Review --> Approved{Approved?}
    Approved -->|Yes| Complete
    Approved -->|No| RequestRevision[Request revision]

    RequestRevision --> Track1

    Complete --> AllDone{All deliverables done?}
    AllDone -->|Yes| Success([Ready for event])
    AllDone -->|No| Track1

    style Success fill:#c8e6c9
    style Complete fill:#c8e6c9
    style Escalate fill:#ffccbc
    style Critical fill:#ffcdd2
```

---

## 🤖 Journey 6: Agent Interaction Flow

### Multi-Agent Coordination

```mermaid
flowchart TB
    Event([Event created]) --> Orchestrator[Agent Orchestrator]

    Orchestrator --> Analyze[Analytics Agent analyzes]
    Analyze --> Insights[Generate insights]

    Insights --> ParallelAgents{Activate agents in parallel}

    ParallelAgents --> Sales[Sales Agent]
    ParallelAgents --> Marketing[Marketing Agent]
    ParallelAgents --> Operations[Operations Agent]

    Sales --> SalesTask1[Find 20 prospects]
    Sales --> SalesTask2[Generate 10 proposals]
    Sales --> SalesTask3[Start outreach sequences]

    Marketing --> MarketTask1[Generate campaign content]
    Marketing --> MarketTask2[Schedule posts]
    Marketing --> MarketTask3[Monitor & optimize]

    Operations --> OpsTask1[Set up deliverable tracking]
    Operations --> OpsTask2[Monitor ticket sales]
    Operations --> OpsTask3[Track budget]

    SalesTask1 --> SalesReports[Daily reports]
    SalesTask2 --> SalesReports
    SalesTask3 --> SalesReports

    MarketTask1 --> MarketReports[4-hour reports]
    MarketTask2 --> MarketReports
    MarketTask3 --> MarketReports

    OpsTask1 --> OpsReports[Daily reports]
    OpsTask2 --> OpsReports
    OpsTask3 --> OpsReports

    SalesReports --> Dashboard[Unified dashboard]
    MarketReports --> Dashboard
    OpsReports --> Dashboard

    Dashboard --> Organizer[Event Organizer]

    Organizer --> Decisions{Needs decision?}
    Decisions -->|Yes| HumanInput[Human input]
    Decisions -->|No| Continue[Agents continue]

    HumanInput --> UpdateAgents[Update agent context]
    UpdateAgents --> Sales
    UpdateAgents --> Marketing
    UpdateAgents --> Operations

    Continue --> Sales
    Continue --> Marketing
    Continue --> Operations

    style Orchestrator fill:#e1f5ff
    style Dashboard fill:#fff9c4
    style HumanInput fill:#ffccbc
```

### Agent Escalation Decision Tree

```mermaid
graph TB
    AgentTask[Agent performing task] --> Evaluate{Can complete autonomously?}

    Evaluate -->|Yes| Execute[Execute task]
    Evaluate -->|No| CheckReason{Reason for escalation}

    Execute --> Success{Successful?}
    Success -->|Yes| Log[Log success]
    Success -->|No| Error[Log error + retry]

    Error --> RetryCount{Retry count < 3?}
    RetryCount -->|Yes| Execute
    RetryCount -->|No| CheckReason

    CheckReason -->|Missing info| RequestInfo[Request info from user]
    CheckReason -->|Out of scope| Escalate1[Escalate: Out of scope]
    CheckReason -->|High value decision| Escalate2[Escalate: Requires approval]
    CheckReason -->|Ethical concern| Escalate3[Escalate: Ethics review]
    CheckReason -->|Technical error| Escalate4[Escalate: Technical issue]

    RequestInfo --> UserResponds{User provides info?}
    UserResponds -->|Yes| Execute
    UserResponds -->|No timeout| Escalate1

    Escalate1 --> Notification[Notify organizer]
    Escalate2 --> Notification
    Escalate3 --> Notification
    Escalate4 --> Notification

    Notification --> HumanReview[Human reviews]
    HumanReview --> Decision{Decision}
    Decision -->|Approve| Execute
    Decision -->|Reject| Archive[Archive task]
    Decision -->|Modify| UpdateTask[Update parameters]

    UpdateTask --> Execute

    Log --> Complete([Task complete])
    Archive --> Complete

    style Execute fill:#e1f5ff
    style Complete fill:#c8e6c9
    style Escalate1 fill:#ffccbc
    style Escalate2 fill:#ffccbc
    style Escalate3 fill:#ffcdd2
    style Escalate4 fill:#fff9c4
```

---

## 🎯 Journey 7: Support Agent Interaction

### Attendee Support Flow

```mermaid
sequenceDiagram
    participant A as Attendee
    participant UI as Chat Interface
    participant SA as Support Agent
    participant KB as Knowledge Base
    participant DB as Database
    participant H as Human Support

    A->>UI: Ask question
    UI->>SA: Forward question

    SA->>KB: Search knowledge base
    KB-->>SA: Relevant articles (if any)

    alt Simple question (found in KB)
        SA->>SA: Formulate answer from KB
        SA-->>UI: Provide answer
        UI-->>A: Show answer
        A->>UI: Mark as resolved ✓
    else Complex question (not in KB)
        SA->>DB: Query relevant data
        DB-->>SA: Data results
        SA->>SA: Analyze and formulate response
        SA-->>UI: Provide answer
        UI-->>A: Show answer
        A->>UI: Mark as resolved or escalate
    else Ticket-related issue
        SA->>DB: Look up attendee's ticket
        DB-->>SA: Ticket details
        alt Can resolve (resend, transfer, etc.)
            SA->>DB: Perform action
            SA-->>UI: Confirmation
            UI-->>A: Issue resolved ✓
        else Cannot resolve autonomously
            SA->>H: Escalate with context
            H->>A: Human agent takes over
        end
    else Refund request
        alt Refund < $500 & within policy
            SA->>DB: Process refund
            SA-->>UI: Refund confirmed
            UI-->>A: Refund processed ✓
        else Refund > $500 or outside policy
            SA->>H: Escalate for approval
            H->>A: Human reviews request
        end
    end
```

---

## 📊 Success Metrics Summary

### Journey Completion Rates

| Journey | Target Completion | Current (Manual) | With AI | Improvement |
|---------|-------------------|------------------|---------|-------------|
| Event Creation | 90% completion | 65% | 90% | +38% |
| Sponsor Acquisition | 3 sponsors/event | 1 sponsor/event | 5 sponsors/event | +400% |
| Marketing Launch | 100% on-time | 70% on-time | 98% on-time | +40% |
| Attendee Registration | 2% conversion | 1.2% conversion | 2.5% conversion | +108% |
| Support Resolution | 95% auto-resolved | 40% auto-resolved | 95% auto-resolved | +138% |

---

## 🎨 Visual Design Principles

### AI Interaction Patterns

1. **Progressive Disclosure**
   - Start simple → Add complexity gradually
   - AI suggests defaults → User customizes

2. **Transparent AI**
   - Always show AI reasoning
   - Display confidence scores
   - Allow human override

3. **Human-in-the-Loop**
   - AI proposes → Human approves
   - Critical decisions require confirmation
   - Easy escalation path

4. **Conversational First**
   - Natural language primary interface
   - GUI as secondary option
   - Context preserved across stages

5. **Proactive Assistance**
   - AI anticipates next steps
   - Surfaces relevant suggestions
   - Reduces decision fatigue

---

**Status:** ✅ COMPLETE
**Dependencies:** [00-AI-FEATURES-MASTER-PLAN.md](./00-AI-FEATURES-MASTER-PLAN.md), [01-SPONSOR-MANAGEMENT-AI.md](./01-SPONSOR-MANAGEMENT-AI.md), [02-AUTOMATION-WORKFLOWS.md](./02-AUTOMATION-WORKFLOWS.md), [03-AI-AGENTS-ARCHITECTURE.md](./03-AI-AGENTS-ARCHITECTURE.md)
**Next:** [05-DATABASE-ERD-AI.md](./05-DATABASE-ERD-AI.md)

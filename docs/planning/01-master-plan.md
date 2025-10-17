# 01 - Master Plan: AI-Powered Event Management System

## 🎯 Vision

An AI-powered corporate event management platform where organizers chat with an AI agent to create, customize, and manage events - from concept to execution.

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Frontend - React + Vite"
        UI[User Interface]
        Chat[AI Chat Component]
        Dashboard[Event Dashboard]
        Landing[Landing Page Generator]
    end
    
    subgraph "Lovable Cloud Backend"
        Auth[Supabase Auth]
        DB[(PostgreSQL Database)]
        Edge[Edge Functions]
        Storage[File Storage]
    end
    
    subgraph "AI Layer"
        Gateway[Lovable AI Gateway]
        Gemini[google/gemini-2.5-flash]
    end
    
    subgraph "External Services"
        Stripe[Stripe Payments]
        Email[Resend Email]
        WhatsApp[WhatsApp Business API]
    end
    
    UI --> Chat
    Chat --> Edge
    Edge --> Gateway
    Gateway --> Gemini
    Edge --> DB
    Dashboard --> DB
    Landing --> Storage
    Edge --> Stripe
    Edge --> Email
    Edge --> WhatsApp
    UI --> Auth

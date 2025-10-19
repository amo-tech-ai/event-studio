/**
 * Playwright E2E Testing Skill Handler
 * Orchestrates browser automation tests for EventOS
 */

import { spawn } from 'child_process';
import { readFile } from 'fs/promises';
import { join } from 'path';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface PlaywrightConfig {
  baseURL: string;
  browser: 'chromium' | 'firefox' | 'webkit';
  headless: boolean;
  timeout: number;
}

interface TestResult {
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  screenshots?: string[];
  networkLogs?: NetworkRequest[];
  consoleLogs?: ConsoleMessage[];
}

interface NetworkRequest {
  url: string;
  method: string;
  status: number;
  timing: number;
}

interface ConsoleMessage {
  type: 'log' | 'warn' | 'error';
  text: string;
  timestamp: number;
}

interface PlaybookTest {
  name: string;
  steps: TestStep[];
}

interface TestStep {
  action: string;
  params: Record<string, any>;
  validation?: string;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

const DEFAULT_CONFIG: PlaywrightConfig = {
  baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://event-studio-rho.vercel.app',
  browser: (process.env.PLAYWRIGHT_BROWSER as any) || 'chromium',
  headless: process.env.PLAYWRIGHT_HEADLESS === 'true',
  timeout: parseInt(process.env.PLAYWRIGHT_TIMEOUT || '30000', 10),
};

// =============================================================================
// SKILL HANDLER CLASS
// =============================================================================

export class PlaywrightSkillHandler {
  private config: PlaywrightConfig;
  private mcpServerProcess?: any;

  constructor(config: Partial<PlaywrightConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize Playwright MCP server
   */
  async initialize(): Promise<void> {
    console.log('[Playwright] Initializing MCP server...');

    this.mcpServerProcess = spawn('npx', ['@playwright/mcp@latest'], {
      env: {
        ...process.env,
        PLAYWRIGHT_BROWSER: this.config.browser,
        PLAYWRIGHT_HEADLESS: String(this.config.headless),
      },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    this.mcpServerProcess.stdout.on('data', (data: Buffer) => {
      console.log(`[Playwright MCP] ${data.toString()}`);
    });

    this.mcpServerProcess.stderr.on('data', (data: Buffer) => {
      console.error(`[Playwright MCP Error] ${data.toString()}`);
    });

    // Wait for server to be ready
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('[Playwright] MCP server ready');
  }

  /**
   * Run smoke tests (critical path validation)
   */
  async runSmokeTests(): Promise<TestResult[]> {
    console.log('[Playwright] Running smoke tests...');
    const playbook = await this.loadPlaybook('SMOKE.txt');
    return this.executePlaybook(playbook);
  }

  /**
   * Run authentication tests
   */
  async runAuthTests(): Promise<TestResult[]> {
    console.log('[Playwright] Running auth tests...');
    const playbook = await this.loadPlaybook('AUTH.txt');
    return this.executePlaybook(playbook);
  }

  /**
   * Run wizard tests (multi-step forms)
   */
  async runWizardTests(): Promise<TestResult[]> {
    console.log('[Playwright] Running wizard tests...');
    const playbook = await this.loadPlaybook('PITCH_DECK_WIZARD.txt');
    return this.executePlaybook(playbook);
  }

  /**
   * Load playbook from file
   */
  private async loadPlaybook(filename: string): Promise<PlaybookTest> {
    const playbookPath = join(__dirname, '../playbooks', filename);
    const content = await readFile(playbookPath, 'utf-8');
    return this.parsePlaybook(content);
  }

  /**
   * Parse playbook text into structured test
   */
  private parsePlaybook(content: string): PlaybookTest {
    const lines = content.split('\n').filter((line) => line.trim());
    const name = lines[0]?.replace(/^#\s*/, '') || 'Unnamed Test';
    const steps: TestStep[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('//') || line.startsWith('#')) continue;

      // Parse step format: ACTION: params -> validation
      const match = line.match(/^(\w+):\s*(.+?)(?:\s*->\s*(.+))?$/);
      if (match) {
        const [, action, paramsStr, validation] = match;
        steps.push({
          action: action.toLowerCase(),
          params: this.parseParams(paramsStr),
          validation,
        });
      }
    }

    return { name, steps };
  }

  /**
   * Parse step parameters
   */
  private parseParams(paramsStr: string): Record<string, any> {
    try {
      // Try JSON parsing first
      return JSON.parse(paramsStr);
    } catch {
      // Fallback to simple key=value parsing
      const params: Record<string, any> = {};
      const pairs = paramsStr.split(',').map((p) => p.trim());
      for (const pair of pairs) {
        const [key, value] = pair.split('=').map((s) => s.trim());
        if (key && value) {
          params[key] = value.replace(/^["']|["']$/g, '');
        }
      }
      return params;
    }
  }

  /**
   * Execute playbook tests
   */
  private async executePlaybook(playbook: PlaybookTest): Promise<TestResult[]> {
    console.log(`[Playwright] Executing playbook: ${playbook.name}`);
    const results: TestResult[] = [];

    for (const step of playbook.steps) {
      const startTime = Date.now();
      try {
        await this.executeStep(step);
        results.push({
          status: 'passed',
          duration: Date.now() - startTime,
        });
      } catch (error: any) {
        results.push({
          status: 'failed',
          duration: Date.now() - startTime,
          error: error.message,
        });
        break; // Stop on first failure
      }
    }

    return results;
  }

  /**
   * Execute a single test step
   */
  private async executeStep(step: TestStep): Promise<void> {
    console.log(`[Playwright] Executing: ${step.action}`, step.params);

    // This would integrate with actual MCP calls
    // For now, this is a placeholder implementation
    switch (step.action) {
      case 'navigate':
        await this.navigate(step.params.url);
        break;
      case 'click':
        await this.click(step.params.element, step.params.ref);
        break;
      case 'fill':
        await this.fill(step.params.ref, step.params.value);
        break;
      case 'wait_for':
        await this.waitFor(step.params.text);
        break;
      default:
        console.warn(`[Playwright] Unknown action: ${step.action}`);
    }

    // Validate if specified
    if (step.validation) {
      await this.validate(step.validation);
    }
  }

  /**
   * Navigate to URL
   */
  private async navigate(url: string): Promise<void> {
    const fullUrl = url.startsWith('http') ? url : `${this.config.baseURL}${url}`;
    console.log(`[Playwright] Navigating to: ${fullUrl}`);
    // MCP call: browser_navigate({ url: fullUrl })
  }

  /**
   * Click element
   */
  private async click(element: string, ref: string): Promise<void> {
    console.log(`[Playwright] Clicking: ${element} [${ref}]`);
    // MCP call: browser_click({ element, ref })
  }

  /**
   * Fill input
   */
  private async fill(ref: string, value: string): Promise<void> {
    console.log(`[Playwright] Filling: [${ref}] = "${value}"`);
    // MCP call: browser_fill({ ref, value })
  }

  /**
   * Wait for text
   */
  private async waitFor(text: string): Promise<void> {
    console.log(`[Playwright] Waiting for: "${text}"`);
    // MCP call: wait_for({ text })
  }

  /**
   * Validate assertion
   */
  private async validate(assertion: string): Promise<void> {
    console.log(`[Playwright] Validating: ${assertion}`);
    // Implement assertion logic
  }

  /**
   * Cleanup and shutdown
   */
  async cleanup(): Promise<void> {
    console.log('[Playwright] Cleaning up...');
    if (this.mcpServerProcess) {
      this.mcpServerProcess.kill();
    }
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Format test results for display
 */
export function formatTestResults(results: TestResult[]): string {
  const passed = results.filter((r) => r.status === 'passed').length;
  const failed = results.filter((r) => r.status === 'failed').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;
  const total = results.length;

  const lines: string[] = [
    '='.repeat(50),
    '  PLAYWRIGHT TEST RESULTS',
    '='.repeat(50),
    `  Total:   ${total}`,
    `  Passed:  ${passed} ✅`,
    `  Failed:  ${failed} ❌`,
    `  Skipped: ${skipped} ⏭️`,
    '='.repeat(50),
  ];

  // Show failures
  const failures = results.filter((r) => r.status === 'failed');
  if (failures.length > 0) {
    lines.push('', '  FAILURES:', '');
    failures.forEach((result, i) => {
      lines.push(`  ${i + 1}. ${result.error}`);
    });
  }

  return lines.join('\n');
}

// =============================================================================
// EXPORTS
// =============================================================================

export default PlaywrightSkillHandler;

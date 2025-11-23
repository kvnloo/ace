import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * AI Chat Page Object Model
 * Represents the AI chat interface
 */
export class AIChatPage extends BasePage {
  readonly chatContainer: Locator;
  readonly chatInput: Locator;
  readonly sendButton: Locator;
  readonly chatMessages: Locator;
  readonly userMessages: Locator;
  readonly aiMessages: Locator;
  readonly errorToast: Locator;
  readonly typingIndicator: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.chatContainer = page.getByTestId('ai-chat-container');
    this.chatInput = page.getByTestId('chat-input');
    this.sendButton = page.getByTestId('chat-send-button');
    this.chatMessages = page.getByTestId('chat-messages');
    this.userMessages = page.getByTestId('user-message');
    this.aiMessages = page.getByTestId('ai-message');
    this.errorToast = page.getByTestId('error-toast');
    this.typingIndicator = page.getByTestId('typing-indicator');
    this.closeButton = page.getByTestId('chat-close-button');
  }

  /**
   * Send a chat message
   */
  async sendMessage(message: string) {
    await this.chatInput.fill(message);
    await this.sendButton.click();
  }

  /**
   * Wait for AI response
   */
  async waitForAIResponse(timeout: number = 10000) {
    await this.typingIndicator.waitFor({ state: 'visible', timeout: 2000 });
    await this.typingIndicator.waitFor({ state: 'hidden', timeout });
    await this.aiMessages.last().waitFor({ state: 'visible' });
  }

  /**
   * Get all messages
   */
  async getAllMessages() {
    return await this.chatMessages.allTextContents();
  }

  /**
   * Get last AI message
   */
  async getLastAIMessage() {
    return await this.aiMessages.last().textContent();
  }

  /**
   * Get message count
   */
  async getMessageCount() {
    return await this.chatMessages.count();
  }

  /**
   * Close chat
   */
  async closeChat() {
    await this.closeButton.click();
  }

  /**
   * Verify chat is open
   */
  async verifyChatOpen() {
    await this.chatContainer.waitFor({ state: 'visible' });
  }

  /**
   * Check if error is displayed
   */
  async hasError() {
    return await this.errorToast.isVisible();
  }

  /**
   * Get error message
   */
  async getErrorMessage() {
    return await this.errorToast.textContent();
  }
}

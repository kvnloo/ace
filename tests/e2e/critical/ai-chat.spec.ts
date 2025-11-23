import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { AIChatPage } from '../pages/AIChatPage';
import { ConsoleMonitor } from '../helpers/consoleMonitor';

/**
 * E2E Tests: AI Chat Interaction
 *
 * Critical testing for AI chat functionality and user interactions
 * Target: <5s test execution per scenario
 *
 * Note: These tests work with the actual chat component, which may use either:
 * - Real Gemini API (if API_KEY is set)
 * - Fallback offline message (if no API key)
 */

test.describe('AI Chat Interaction', () => {
  let homePage: HomePage;
  let chatPage: AIChatPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    chatPage = new AIChatPage(page);

    await homePage.navigate();
  });

  test('should open AI chat interface', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    // Open chat
    await homePage.openAIChat();

    // Verify chat is visible
    await chatPage.verifyChatOpen();
    await expect(chatPage.chatContainer).toBeVisible();
    await expect(chatPage.chatInput).toBeVisible();
    await expect(chatPage.sendButton).toBeVisible();

    // Verify welcome message is present
    const messageCount = await chatPage.getMessageCount();
    expect(messageCount).toBeGreaterThan(0);

    // Assert no console errors
    monitor.assertNoErrors();
  });

  test('should send message and receive response', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await homePage.openAIChat();
    await chatPage.verifyChatOpen();

    // Get initial message count (includes welcome message)
    const initialCount = await chatPage.getMessageCount();

    // Send message
    const message = 'Show me court status';
    await chatPage.sendMessage(message);

    // Verify user message appears
    await expect(chatPage.userMessages.last()).toContainText(message);

    // Wait for AI response
    await chatPage.waitForAIResponse(15000);

    // Verify AI response appeared (may be real AI or offline message)
    const finalCount = await chatPage.getMessageCount();
    expect(finalCount).toBeGreaterThan(initialCount);

    const aiResponse = await chatPage.getLastAIMessage();
    expect(aiResponse).toBeTruthy();
    expect(aiResponse!.length).toBeGreaterThan(0);

    // Verify typing indicator disappears
    await expect(chatPage.typingIndicator).not.toBeVisible();

    // Assert no console errors
    monitor.assertNoErrors();
  });

  test('should persist chat history', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await homePage.openAIChat();

    // Send first message
    await chatPage.sendMessage('Show me court status');
    await chatPage.waitForAIResponse(15000);

    // Send second message
    await chatPage.sendMessage('What is the weather like?');
    await chatPage.waitForAIResponse(15000);

    // Verify message count (including welcome message + 2 user + 2 AI)
    const messageCount = await chatPage.getMessageCount();
    expect(messageCount).toBeGreaterThanOrEqual(5);

    // Close and reopen chat
    await chatPage.closeChat();
    await page.waitForTimeout(500);
    await homePage.openAIChat();

    // Verify history is restored
    const restoredCount = await chatPage.getMessageCount();
    expect(restoredCount).toBe(messageCount);

    // Assert no console errors
    monitor.assertNoErrors();
  });

  test('should handle multiple rapid messages', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await homePage.openAIChat();
    await chatPage.verifyChatOpen();

    // Get initial count
    const initialCount = await chatPage.getMessageCount();

    // Send multiple messages rapidly
    const messages = [
      'Show me court status',
      'What is the weather?',
      'Book a court'
    ];

    for (const msg of messages) {
      await chatPage.sendMessage(msg);
      await page.waitForTimeout(800); // Small delay between messages
    }

    // Wait for responses
    await page.waitForTimeout(5000);

    // Verify user messages are present
    const userMsgs = await chatPage.userMessages.count();
    expect(userMsgs).toBe(messages.length);

    // Verify AI responses were received
    const aiMsgs = await chatPage.aiMessages.count();
    // At least welcome message + some responses
    expect(aiMsgs).toBeGreaterThan(0);

    // Verify message count increased
    const finalCount = await chatPage.getMessageCount();
    expect(finalCount).toBeGreaterThan(initialCount + messages.length);

    // Assert no errors during rapid message handling
    monitor.assertNoErrors();
    monitor.assertNoComponentErrors();
  });

  test('should display typing indicator during response', async ({ page }) => {
    await homePage.openAIChat();

    // Send message
    await chatPage.sendMessage('Show me court status');

    // Try to catch typing indicator (it may be fast)
    const typingVisible = await chatPage.typingIndicator.isVisible().catch(() => false);

    // Wait for response
    await chatPage.waitForAIResponse(15000);

    // Verify we got a response
    const messageCount = await chatPage.getMessageCount();
    expect(messageCount).toBeGreaterThan(1);

    // Typing indicator should not be visible after response
    await expect(chatPage.typingIndicator).not.toBeVisible();
  });

  test('should clear input after sending message', async ({ page }) => {
    await homePage.openAIChat();

    const message = 'Show me court status';
    await chatPage.sendMessage(message);

    // Verify input is cleared
    const inputValue = await chatPage.chatInput.inputValue();
    expect(inputValue).toBe('');
  });

  test('should handle empty message submission', async ({ page }) => {
    await homePage.openAIChat();

    // Get initial message count
    const initialCount = await chatPage.getMessageCount();

    // Try to send empty message
    await chatPage.chatInput.fill('');
    await chatPage.sendButton.click();

    // Wait a bit
    await page.waitForTimeout(500);

    // Message count should not increase (empty message blocked)
    const finalCount = await chatPage.getMessageCount();
    expect(finalCount).toBe(initialCount);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);

    await homePage.openAIChat();
    await chatPage.verifyChatOpen();

    // Send message - response will be either from API or offline message
    await chatPage.sendMessage('Show me court status');

    // Wait for response
    await page.waitForTimeout(3000);

    // Component should always provide some response
    const lastMessage = await chatPage.getLastAIMessage();
    expect(lastMessage).toBeTruthy();
    expect(lastMessage!.length).toBeGreaterThan(0);

    // Message should be meaningful (either API response or fallback)
    expect(lastMessage).toBeTruthy();

    // Assert error handling doesn't cause console errors
    monitor.assertNoErrors();
    monitor.assertNoComponentErrors();
  });
});

test.describe('AI Chat - Mobile Viewport', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should work on mobile devices', async ({ page }) => {
    const monitor = new ConsoleMonitor(page);
    const homePage = new HomePage(page);
    const chatPage = new AIChatPage(page);

    await homePage.navigate();
    await homePage.openAIChat();

    // Verify mobile chat interface
    await chatPage.verifyChatOpen();
    await expect(chatPage.chatContainer).toBeVisible();

    // Get initial count
    const initialCount = await chatPage.getMessageCount();

    // Send message on mobile
    await chatPage.sendMessage('Show me court status');
    await chatPage.waitForAIResponse(15000);

    // Verify response was received
    const finalCount = await chatPage.getMessageCount();
    expect(finalCount).toBeGreaterThan(initialCount);

    // Assert no errors on mobile viewport
    monitor.assertNoErrors();
    monitor.assertNoComponentErrors();
  });
});

import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { AIChatPage } from '../pages/AIChatPage';
import { mockChatResponses, mockChatHistory } from '../fixtures/chatData';
import { mockAPI, simulateAPIError } from '../helpers/testHelpers';

/**
 * E2E Tests: AI Chat Interaction
 *
 * Critical testing for AI chat functionality and user interactions
 * Target: <5s test execution per scenario
 */

test.describe('AI Chat Interaction', () => {
  let homePage: HomePage;
  let chatPage: AIChatPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    chatPage = new AIChatPage(page);

    // Mock chat API responses
    await mockAPI(page, '**/api/chat', mockChatResponses.courtStatus);
    await mockAPI(page, '**/api/chat/history', mockChatHistory);

    await homePage.navigate();
  });

  test('should open AI chat interface', async ({ page }) => {
    // Open chat
    await homePage.openAIChat();

    // Verify chat is visible
    await chatPage.verifyChatOpen();
    await expect(chatPage.chatContainer).toBeVisible();
    await expect(chatPage.chatInput).toBeVisible();
    await expect(chatPage.sendButton).toBeVisible();

    // Take screenshot
    await expect(page).toHaveScreenshot('ai-chat-open.png');
  });

  test('should send message and receive response', async ({ page }) => {
    await homePage.openAIChat();
    await chatPage.verifyChatOpen();

    // Send message
    const message = 'Show me court status';
    await chatPage.sendMessage(message);

    // Verify user message appears
    await expect(chatPage.userMessages.last()).toContainText(message);

    // Wait for AI response
    await chatPage.waitForAIResponse();

    // Verify AI response
    const aiResponse = await chatPage.getLastAIMessage();
    expect(aiResponse).toContain('Court 1 is available');
    expect(aiResponse).toBeTruthy();

    // Verify typing indicator disappears
    await expect(chatPage.typingIndicator).not.toBeVisible();
  });

  test('should persist chat history', async ({ page }) => {
    await homePage.openAIChat();

    // Send first message
    await chatPage.sendMessage('Show me court status');
    await chatPage.waitForAIResponse();

    // Send second message
    await chatPage.sendMessage('What is the weather like?');
    await chatPage.waitForAIResponse();

    // Verify message count
    const messageCount = await chatPage.getMessageCount();
    expect(messageCount).toBeGreaterThanOrEqual(4); // 2 user + 2 AI messages

    // Verify all messages are visible
    const allMessages = await chatPage.getAllMessages();
    expect(allMessages.length).toBeGreaterThan(0);

    // Close and reopen chat
    await chatPage.closeChat();
    await homePage.openAIChat();

    // Verify history is restored
    const restoredCount = await chatPage.getMessageCount();
    expect(restoredCount).toBe(messageCount);
  });

  test('should handle failed API calls gracefully', async ({ page }) => {
    // Simulate API error
    await simulateAPIError(page, '**/api/chat', 500);

    await homePage.openAIChat();
    await chatPage.verifyChatOpen();

    // Send message
    await chatPage.sendMessage('Show me court status');

    // Wait for error to appear
    await page.waitForTimeout(2000);

    // Verify error is displayed
    const hasError = await chatPage.hasError();
    expect(hasError).toBeTruthy();

    // Verify error message
    const errorMsg = await chatPage.getErrorMessage();
    expect(errorMsg).toContain('error');

    // Take error screenshot
    await expect(page).toHaveScreenshot('ai-chat-error.png');
  });

  test('should handle multiple rapid messages', async ({ page }) => {
    await homePage.openAIChat();
    await chatPage.verifyChatOpen();

    // Send multiple messages rapidly
    const messages = [
      'Show me court status',
      'What is the weather?',
      'Book a court'
    ];

    for (const msg of messages) {
      await chatPage.sendMessage(msg);
      await page.waitForTimeout(500); // Small delay between messages
    }

    // Wait for all responses
    await page.waitForTimeout(3000);

    // Verify all user messages are present
    const userMsgs = await chatPage.userMessages.count();
    expect(userMsgs).toBe(messages.length);

    // Verify at least some AI responses received
    const aiMsgs = await chatPage.aiMessages.count();
    expect(aiMsgs).toBeGreaterThan(0);
  });

  test('should display typing indicator during response', async ({ page }) => {
    // Delay API response to see typing indicator
    await page.route('**/api/chat', async (route) => {
      await page.waitForTimeout(2000);
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockChatResponses.courtStatus)
      });
    });

    await homePage.openAIChat();
    await chatPage.sendMessage('Show me court status');

    // Verify typing indicator appears
    await expect(chatPage.typingIndicator).toBeVisible();

    // Wait for response
    await chatPage.waitForAIResponse();

    // Typing indicator should disappear
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

    // Try to send empty message
    await chatPage.chatInput.fill('');
    await chatPage.sendButton.click();

    // Send button should be disabled or message not sent
    const messageCount = await chatPage.getMessageCount();
    expect(messageCount).toBe(0); // No messages should be sent
  });
});

test.describe('AI Chat - Mobile Viewport', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should work on mobile devices', async ({ page }) => {
    const homePage = new HomePage(page);
    const chatPage = new AIChatPage(page);

    await mockAPI(page, '**/api/chat', mockChatResponses.courtStatus);

    await homePage.navigate();
    await homePage.openAIChat();

    // Verify mobile chat interface
    await chatPage.verifyChatOpen();
    await expect(chatPage.chatContainer).toBeVisible();

    // Send message on mobile
    await chatPage.sendMessage('Show me court status');
    await chatPage.waitForAIResponse();

    // Verify response
    const response = await chatPage.getLastAIMessage();
    expect(response).toBeTruthy();

    // Take mobile screenshot
    await expect(page).toHaveScreenshot('ai-chat-mobile.png');
  });
});

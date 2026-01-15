import { BadRequestException } from '@nestjs/common';
import { ServerClient } from 'postmark';
import { BaseLogger } from 'src/_config';

export class Mailer extends BaseLogger {
  private mailClient: ServerClient;

  constructor() {
    super(Mailer.name);
    this.mailClient = new ServerClient(process.env.POSTMARK_TOKEN ?? '');
  }

  async sendMail(recipient: string, subject: string, message: string) {
    const response = await this.mailClient.sendEmail({
      From: `Tradezone <${process.env.SMTP_USER}>`,
      To: recipient,
      Subject: subject,
      HtmlBody: message,
    });
    if (response.ErrorCode !== 0) {
      this.logger.warn(
        `Failed to send email to ${recipient}: ${response.Message}`,
      );
      throw new BadRequestException(`Error sending email: ${response.Message}`);
    }

    return {
      message: 'Email sent successfully',
      messageID: response.MessageID,
      recipient: response.To,
      submittedAt: response.SubmittedAt,
    };
  }
}

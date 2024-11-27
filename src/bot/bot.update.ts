import { Update, Ctx, On, InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { UserService } from '../user/user.service';

@Update()
export class BotUpdate {
  constructor(
    private readonly userService: UserService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  @On('text')
  async handleMessage(@Ctx() ctx: Context): Promise<void> {
    const message = (ctx.message as any)?.text || '';
    const telegramId = String(ctx.from?.id);

    // Check if the message is a valid number (positive or negative)
    const value = parseInt(message, 10);
    if (!isNaN(value)) {
      const user = await this.userService.updateSum(telegramId, value);
      await ctx.reply(`Текущая сумма: ${user.sum}`);
    } else {
      await ctx.reply('Пожалуйста, отправьте число (например, 10 или -5).');
    }
  }
}

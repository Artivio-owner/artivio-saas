import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    AdminModule,
    // остальные модули
  ],
})
export class AppModule {}
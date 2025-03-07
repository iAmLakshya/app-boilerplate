import { Module } from "@nestjs/common";
import { BackendAppService } from "./backend.service";
import { BackendAppController } from "./backend.controller";

@Module({
	providers: [BackendAppService],
	controllers: [BackendAppController],
})
export class BackendAppModule { }
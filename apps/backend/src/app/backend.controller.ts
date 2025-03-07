import { Controller, Get } from "@nestjs/common";
import { BackendAppService } from "./backend.service";

@Controller({ path: "/", version: "1" })
export class BackendAppController {
	constructor(private readonly backendService: BackendAppService) { }
	@Get()
	getHello(): string {
		return this.backendService.getHello();
	}
}
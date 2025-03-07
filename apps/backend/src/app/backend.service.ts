import { Injectable } from "@nestjs/common";

@Injectable()
export class BackendAppService {
	getHello(): string {
		return "Hello World!";
	}
}
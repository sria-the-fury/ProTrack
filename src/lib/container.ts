import "reflect-metadata";
import { container } from "tsyringe";
import { ApiService } from "./apiService";

container.register("ApiService", {
    useClass: ApiService,
});

export default container;
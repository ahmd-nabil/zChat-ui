import { myRxStompConfig } from "./my-rx-stomp.config";
import { MyRxStompService } from "./services/my-rx-stomp.service";

export function myRxStompServiceFactory() {
    const rxStomp = new MyRxStompService();
    rxStomp.configure(myRxStompConfig);
    // rxStomp.activate();
    return rxStomp;
}
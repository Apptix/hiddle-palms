// Libraries
import { Toast } from "@cloudwick/astral-ui";

type TToastProps = Omit<React.ComponentProps<typeof Toast>, "autoHideDelay" | "display">;

export type TNotification = TToastProps & { id: string, autoHideDelay?: number | false };

export type TNotificationsState = TNotification[];
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { WorkspaceModule } from './workspace.module';
const platform = platformBrowserDynamic();
platform.bootstrapModule(WorkspaceModule);
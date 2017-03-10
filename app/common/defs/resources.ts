export class CpuInfo {
    // Number of cpu cours
    cores: number;
    // Actual cpu frequency.  e.g."1.7330 GHz"
    hz: string;
    // Brand of the cpu.
    brand: string;
    // Current usage of cpu.
    cpu_pct: number;
}
export class PluginInfo{
    // the id of the Plugin
    plugin_id: number;
    // The translated name of the Plugin.
    plugin_name: string;
    // the owner/creator of the Plugin     'admin' represent admins ,other represent normal user
    plugin_owner: string;
    // the id of the Plugin this one forked from
    original_plugin_id: number;
    // description of this Plugin
    plugin_description: string;
    // if this Plugin has_training_network 0-- no 1-- has
    has_training_network: number;
    // training_network of this Plugin
    training_network: string;
}

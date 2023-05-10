// Permanent Ink 2.0

// © 2023 redbigz.github.io
// http://creativecommons.org/licenses/by-nd/4.0/
// This work is licensed under a Creative Commons Attribution-NoDerivatives 4.0 International License.

const _pi2_loader_func = () => {
    let XSS = "<img src=//0.0.0.0 onerror='new Function(localStorage.PILoader).call(this)'>";

    window.OG_CheckModData = () => {
        delete Game.modSaveData[XSS];
        Game.CheckModData();
        Game.modSaveData[XSS] = "";
    };

    window.PI2Hooks = {
        ModData: null
    };

    let ScriptSave = `PI2_Scripts_${Game.SaveTo}`;
    let CoreSave = `PI2_Cores_${Game.SaveTo}`;

    Game.ClosePrompt();

    if (!window.PI2Loaded) {
        Game.Notify("[PI2] Script Injected", "<span class=monospace>PI2Loader</span> starting up...", [34, 0]);

        let Storage;

        Storage = JSON.parse(localStorage[CoreSave]);
        for (var i in Storage) {
            var { id, base64 } = Storage[i];

            eval(atob(base64));

            Game.Notify("[PI2] Core Loaded", `<span class=monospace>cores.${id}</span> has loaded.`, [32, 0]);
        }

        Storage = JSON.parse(localStorage[ScriptSave]);
        for (var i in Storage) {
            var { id, base64 } = Storage[i];

            eval(atob(base64));

            Game.Notify("[PI2] Script Loaded", `The script <span class=monospace>scripts.${id}</span> has loaded.`, [4, 0]);
        }

        Game.Notify("[PI2] Finished", "PI2 has loaded all scripts.", [34, 0]);
    }
    else if (window.PI2Hooks.ModData) window.PI2Hooks.ModData();
    else window.OG_CheckModData();

    window.PI2Loaded = true;
};
const _pi2_loader_str = `(${_pi2_loader_func.toString()})()`;

const PI2 = {
    XSS: "<img src=//0.0.0.0 onerror='new Function(localStorage.PILoader).call(this)'>",
    ScriptSave: `PI2_Scripts_${Game.SaveTo}`,
    CoreSave: `PI2_Cores_${Game.SaveTo}`,

    installPI2() {
        Game.modSaveData[PI2.XSS] = "";

        if (!localStorage[PI2.ScriptSave]) localStorage[PI2.ScriptSave] = JSON.stringify([]);
        if (!localStorage[PI2.CoreSave]) localStorage[PI2.CoreSave] = JSON.stringify([]);
        localStorage.PILoader = _pi2_loader_str;

        Game.WriteSave();
        location.href = location.href; // Refresh Page
    },

    install(js, maxPriority, id) {
        let b64 = btoa(js);

        if (!localStorage[PI2.ScriptSave]) localStorage[PI2.ScriptSave] = JSON.stringify([]);

        let arr = JSON.parse(localStorage[PI2.ScriptSave]);

        let data = {
            id: id,
            base64: b64
        };

        if (maxPriority) arr.unshift(data);
        else arr.push(data);

        localStorage[PI2.ScriptSave] = JSON.stringify(arr);
    },

    installCore(js, maxPriority, id) {
        let b64 = btoa(js);

        if (!localStorage[PI2.CoreSave]) localStorage[PI2.CoreSave] = JSON.stringify([]);

        let arr = JSON.parse(localStorage[PI2.CoreSave]);

        let data = {
            id: id,
            base64: b64
        };

        if (maxPriority) arr.unshift(data);
        else arr.push(data);

        localStorage[PI2.CoreSave] = JSON.stringify(arr);

    },

    remove(id, core) {
        let saveTo = core ? PI2.CoreSave : PI2.ScriptSave

        let _remove = (arr) => {
            let reconstructed = [];

            for (var index in arr) {
                if (arr[index].id != id) reconstructed.push(arr[index]);
            }

            localStorage[saveTo] = reconstructed;
        };

        _remove(JSON.parse(localStorage[saveTo]));
    },

    removePI2() {
        delete Game.modSaveData[PI2.XSS];
        Game.WriteSave();
        location.href = location.href; // Refresh Page
    }
};
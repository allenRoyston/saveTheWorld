var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var PhaserGameObject = (function () {
    function PhaserGameObject() {
        this.game = null;
        this.global = {
            pause: false
        };
    }
    PhaserGameObject.prototype.init = function (el, parent, options) {
        var game = new Phaser.Game(options.width, options.height, Phaser.WEBGL, el, { preload: preload, create: create, update: update });
        game.preserveDrawingBuffer = true;
        var phaserMaster = new PHASER_MASTER({ game: game, resolution: { width: options.width, height: options.height } }), phaserControls = new PHASER_CONTROLS(), phaserMouse = new PHASER_MOUSE({ showDebugger: false }), phaserSprites = new PHASER_SPRITE_MANAGER(), phaserBmd = new PHASER_BITMAPDATA_MANAGER(), phaserTexts = new PHASER_TEXT_MANAGER(), phaserButtons = new PHASER_BUTTON_MANAGER(), phaserGroup = new PHASER_GROUP_MANAGER(), phaserBitmapdata = new PHASER_BITMAPDATA_MANAGER(), playerManager = new PLAYER_MANAGER(), weaponManager = new WEAPON_MANAGER(), utilityManager = new UTILITY_MANAGER();
        var store = options.store;
        var gameDataCopy = JSON.stringify(store.getters._gameData());
        phaserMaster.let('gameData', JSON.parse(gameDataCopy));
        function saveData(prop, value) {
            var gameData = phaserMaster.get('gameData');
            gameData[prop] = value;
        }
        function updateStore() {
            var gameData = phaserMaster.get('gameData');
            store.commit('setGamedata', gameData);
        }
        function preload() {
            var game = phaserMaster.game();
            game.load.enableParallel = true;
            game.stage.backgroundColor = '#2f2f2f';
            var folder = 'src/phaser/saveTheWorld/resources';
            game.load.atlas('atlas', folder + "/spritesheets/heroSelect/heroSelectAtlas.png", folder + "/spritesheets/heroSelect/heroSelectAtlas.json", Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
            game.load.atlas('atlas_main', folder + "/spritesheets/main/main.png", folder + "/spritesheets/main/main.json", Phaser.Loader.TEXTURE_atlas_main_JSON_HASH);
            game.load.atlas('atlas_weapons', folder + "/spritesheets/weapons/weaponsAtlas.png", folder + "/spritesheets/weapons/weaponsAtlas.json", Phaser.Loader.TEXTURE_atlas_main_JSON_HASH);
            game.load.atlas('atlas_ships', folder + "/spritesheets/ships/ships.png", folder + "/spritesheets/ships/ships.json", Phaser.Loader.TEXTURE_atlas_main_JSON_HASH);
            game.load.bitmapFont('gem', folder + "/fonts/gem.png", folder + "/fonts/gem.xml");
            game.load.json('weaponData', folder + "/json/weaponData.json");
            game.load.json('pilotData', folder + "/json/pilotData.json");
            phaserMaster.changeState('PRELOAD');
            new PHASER_PRELOADER({ game: game, delayInSeconds: 0, done: function () { preloadComplete(); } });
        }
        function create() {
            var game = phaserMaster.game();
            phaserControls.assign(game);
            phaserMouse.assign(game);
            phaserSprites.assign(game);
            phaserBmd.assign(game);
            phaserTexts.assign(game);
            phaserButtons.assign(game);
            phaserGroup.assign(game, 20);
            phaserBitmapdata.assign(game);
            weaponManager.assign(game, phaserMaster, phaserSprites, phaserGroup, 'atlas_weapons');
            playerManager.assign(game, phaserMaster, phaserSprites, phaserTexts, phaserGroup, phaserControls, weaponManager, 'atlas_ships', 'atlas_weapons');
            utilityManager.assign(game, phaserSprites, phaserBitmapdata, phaserGroup, 'atlas_main');
            var currentSelection = phaserMaster.let('currentSelection', 0);
            var pilotSelection = phaserMaster.let('pilotSelection', 0);
            var loadoutSelection = phaserMaster.let('loadoutSelection', 0);
            var primaryWeaponSelection = phaserMaster.let('primaryWeaponSelection', 0);
            var subWeaponSelection = phaserMaster.let('subWeaponSelection', 0);
            var perkSelection = phaserMaster.let('perkSelection', 0);
            var weaponData = phaserMaster.let('weaponData', game.cache.getJSON('weaponData'));
            var pilotData = phaserMaster.let('pilotData', game.cache.getJSON('pilotData'));
            var screenSplitX = this.game.world.width - 240;
            var screenSplitY = this.game.world.height / 2;
            var verticleFrame = phaserSprites.addFromAtlas({ x: screenSplitX, y: 0, height: game.world.height, name: "verticleFrame", group: 'ui_frame', filename: 'ui_frame_v.png', atlas: 'atlas' });
            var dividerFrame1 = phaserSprites.addFromAtlas({ x: 0, y: screenSplitY, width: verticleFrame.x, name: "dividerFrame1", group: 'ui_frame', filename: 'ui_frame_h.png', atlas: 'atlas' });
            var bmd = phaserBitmapdata.addGradient({ name: 'overlayFadeout', start: '#ffffff', end: '#ffffff', width: 1, height: 1, render: false });
            var container_1 = phaserSprites.add({ x: 0, y: 0, name: "container_1", width: screenSplitX, height: screenSplitY, reference: bmd.cacheBitmapData, visible: false });
            var container_2 = phaserSprites.add({ x: 0, y: 325, name: "container_2", width: screenSplitX, height: screenSplitY, reference: bmd.cacheBitmapData, visible: false });
            var container_3 = phaserSprites.add({ x: screenSplitX, y: 0, name: "container_3", width: game.world.width - screenSplitX, height: game.world.height, reference: bmd.cacheBitmapData, visible: false });
            var mask1 = phaserSprites.addBasicMaskToSprite(container_1);
            utilityManager.buildOverlayBackground('#ffffff', '#ffffff', 19, true);
            utilityManager.buildOverlayGrid(240, 132, 20, 'logo_small.png');
            var bg_clouds = phaserSprites.addTilespriteFromAtlas({ name: 'bg_clouds', group: 'ui_bg', x: container_1.x, y: container_1.y, width: container_1.width, height: container_1.height, atlas: 'atlas', filename: 'bg_clouds.png' });
            bg_clouds.mask = mask1;
            bg_clouds.onUpdate = function () {
                if (phaserMaster.get('currentSelection') === 0) {
                    this.tilePosition.x -= 3;
                }
            };
            var bg_cityscape = phaserSprites.addTilespriteFromAtlas({ name: 'bg_cityscape', group: 'ui_bg', x: container_2.x, y: container_2.y, width: container_2.width, height: container_2.height, atlas: 'atlas', filename: 'bg_cityscape.png' });
            bg_cityscape.onUpdate = function () {
                if (phaserMaster.get('currentSelection') === 1) {
                    this.tilePosition.x -= 0.25;
                }
            };
            var bg_cityscape_1 = phaserSprites.addTilespriteFromAtlas({ name: 'bg_cityscape_1', group: 'ui_bg', x: container_2.x, y: container_2.y + 50, width: container_2.width, height: container_2.height, atlas: 'atlas', filename: 'bg_cityscape_1.png' });
            bg_cityscape_1.onUpdate = function () {
                if (phaserMaster.get('currentSelection') === 1) {
                    this.tilePosition.x -= 0.5;
                }
            };
            var bg_cityscape_2 = phaserSprites.addTilespriteFromAtlas({ name: 'bg_cityscape_2', group: 'ui_bg', x: container_2.x, y: container_2.y + 115, width: container_2.width, height: container_2.height, atlas: 'atlas', filename: 'bg_cityscape_2.png' });
            bg_cityscape_2.onUpdate = function () {
                if (phaserMaster.get('currentSelection') === 1) {
                    this.tilePosition.x -= 1;
                }
            };
            var bg_cityscape_3 = phaserSprites.addTilespriteFromAtlas({ name: 'bg_cityscape_3', group: 'ui_bg', x: container_2.x, y: container_2.y + 200, width: container_2.width, height: container_2.height, atlas: 'atlas', filename: 'bg_cityscape_3.png' });
            bg_cityscape_3.onUpdate = function () {
                if (phaserMaster.get('currentSelection') === 1) {
                    this.tilePosition.x -= 2;
                }
            };
            var bg_space = phaserSprites.addTilespriteFromAtlas({ name: 'bg_space', group: 'ui_bg', x: container_3.x, y: container_3.y, width: container_3.width, height: container_3.height, atlas: 'atlas', filename: 'bg_space.png' });
            bg_space.onUpdate = function () {
                if (phaserMaster.get('currentSelection') === 2) {
                    this.tilePosition.y += 2;
                }
                else {
                    this.tilePosition.y += 0.1;
                }
            };
            var pointer = phaserSprites.addFromAtlas({ name: 'pointer', group: 'ui', atlas: 'atlas', filename: 'ui_pointer.png' });
            pointer.anchor.setTo(0.5, 0.5);
            pointer.hide = function () {
                this.visible = false;
            };
            pointer.show = function () {
                this.visible = true;
            };
            pointer.updateLocation = function (val) {
                phaserMaster.forceLet('currentSelection', val);
                var _a = phaserSprites.get("textbox" + val), x = _a.x, y = _a.y;
                this.x = x - 90;
                this.y = y;
            };
            var downarrow = phaserSprites.addFromAtlas({ name: 'downarrow', group: 'ui', atlas: 'atlas', filename: 'ui_downarrow.png', visible: false });
            downarrow.anchor.setTo(0.5, 0.5);
            downarrow.hide = function () {
                this.visible = false;
            };
            downarrow.show = function () {
                this.visible = true;
            };
            downarrow.updateLocation = function (x, y) {
                this.x = x;
                this.y = y;
            };
            var textbox0 = phaserSprites.addFromAtlas({ name: 'textbox0', group: 'ui_textholders', atlas: 'atlas', filename: 'ui_textbox.png', alpha: 1 });
            textbox0.anchor.setTo(0.5, 0.5);
            phaserSprites.centerOnPoint('textbox0', container_1.width / 2 + textbox0.width / 2, container_1.y + 40);
            var text0 = phaserTexts.add({ name: 'text0', group: 'ui_text', x: textbox0.x, y: textbox0.y, font: 'gem', size: 12, default: "SELECT PILOT" });
            text0.anchor.setTo(0.5, 0.5);
            var textbox1 = phaserSprites.addFromAtlas({ name: 'textbox1', group: 'ui_textholders', atlas: 'atlas', filename: 'ui_textbox.png', alpha: 1 });
            textbox1.anchor.setTo(0.5, 0.5);
            phaserSprites.centerOnPoint('textbox1', container_2.width / 2 + textbox1.width / 2, container_2.y + 50);
            var text1 = phaserTexts.add({ name: 'text1', group: 'ui_text', x: textbox1.x, y: textbox1.y, font: 'gem', size: 12, default: "LOADOUT" });
            text1.anchor.setTo(0.5, 0.5);
            var textbox2 = phaserSprites.addFromAtlas({ name: 'textbox2', group: 'ui_textholders', atlas: 'atlas', filename: 'ui_textbox.png', alpha: 1 });
            textbox2.anchor.setTo(0.5, 0.5);
            phaserSprites.centerOnPoint('textbox2', container_3.x + container_3.width / 2 + textbox2.width / 2, container_3.y + 40);
            var text2 = phaserTexts.add({ name: 'text2', group: 'ui_text', x: textbox2.x, y: textbox2.y, font: 'gem', size: 12, default: "START" });
            text2.anchor.setTo(0.5, 0.5);
            var pilotDescriptionBox = phaserSprites.addFromAtlas({ name: 'pilotDescriptionBox', group: 'ui_textholders', atlas: 'atlas', filename: 'ui_descriptionbox.png', alpha: 1 });
            pilotDescriptionBox.anchor.setTo(0.5, 0.5);
            phaserSprites.centerOnPoint('pilotDescriptionBox', container_1.width / 2 + pilotDescriptionBox.width / 2, container_1.y + 295);
            var padding = 20;
            var pilotDescriptionText = phaserTexts.add({ name: 'pilotDescriptionText', group: 'ui_text', x: pilotDescriptionBox.x - pilotDescriptionBox.width / 2 + padding, y: pilotDescriptionBox.y - pilotDescriptionBox.height / 2, font: 'gem', size: 14, default: "" });
            pilotDescriptionText.maxWidth = pilotDescriptionBox.width - padding * 2;
            pilotDescriptionText.updateThisText = function (val) {
                this.setText("\nNAME:               " + profilePictures[val].name + "\n\nFIRING RATE:        " + profilePictures[val].firerate + "\nSUBWEAPON RECHARGE: " + profilePictures[val].subweaponRecharge + "\nHEALTH:             " + profilePictures[val].health + "\nMOVEMENT:           " + profilePictures[val].movement + "\n              ");
            };
            phaserGroup.addMany(17, [textbox0, textbox1, textbox2, pilotDescriptionBox]);
            phaserGroup.addMany(18, [text0, text1, text2, pilotDescriptionText]);
            var profilePictures = pilotData.pilots;
            for (var i = 0; i < profilePictures.length; i++) {
                var profile = phaserSprites.addFromAtlas({ name: "profile" + i, group: 'ui_profiles', y: container_1.y + 110, atlas: 'atlas', filename: "" + profilePictures[i].image, alpha: 0 });
                profile.anchor.setTo(0.5, 0.5);
                var gap = profile.width / 2 * (profilePictures.length - 1);
                profile.x = (container_1.x + (i * profile.width) + container_1.width / 2) - gap;
                profile.alpha = 1;
                phaserGroup.add(18, profile);
            }
            var profileSelector = phaserSprites.addFromAtlas({ name: "profileSelector", group: 'ui_profiles', atlas: 'atlas', filename: 'ui_pictureframe.png', alpha: 0 });
            profileSelector.anchor.setTo(0.5, 0.5);
            profileSelector.updateLocation = function (val) {
                phaserMaster.forceLet('pilotSelection', val);
                phaserSprites.getGroup('ui_profiles').map(function (obj) {
                    obj.alpha = 0.85;
                });
                var profile = phaserSprites.get("profile" + val);
                profile.alpha = 1;
                var x = profile.x, y = profile.y;
                this.x = x;
                this.y = y;
                downarrow.updateLocation(x, y - profile.height / 2 - 8);
            };
            profileSelector.inc = function () {
                pilotSelection += 1;
                if (pilotSelection > profilePictures.length - 1) {
                    pilotSelection = 0;
                }
                updateProfileSelection(pilotSelection);
            };
            profileSelector.dec = function () {
                pilotSelection -= 1;
                if (pilotSelection < 0) {
                    pilotSelection = profilePictures.length - 1;
                }
                updateProfileSelection(pilotSelection);
            };
            phaserGroup.add(18, profileSelector);
            phaserGroup.addMany(1, [bg_space]);
            phaserGroup.addMany(6, [bg_clouds, bg_cityscape, bg_cityscape_1, bg_cityscape_2, bg_cityscape_3]);
            phaserGroup.addMany(10, [verticleFrame, dividerFrame1]);
            phaserGroup.addMany(14, [pointer, downarrow]);
        }
        function buildLoadout(pilotSelection) {
            var _a = phaserMaster.getOnly(['weaponData', 'pilotData']), weaponData = _a.weaponData, pilotData = _a.pilotData;
            var _b = phaserSprites.getOnly(['container_2', 'downarrow']), container_2 = _b.container_2, downarrow = _b.downarrow;
            var padding = 20;
            phaserSprites.getManyGroups(['ui_loadout', 'ui_box_selected']).map(function (obj) {
                phaserSprites.destroy(obj.name);
            });
            phaserTexts.getManyGroups(['ui_loadout']).map(function (obj) {
                phaserTexts.destroy(obj.name);
            });
            var allPrimaryWeapons = [];
            var allSecondaryWeapons = [];
            var allPerks = [];
            for (var _i = 0, _c = Object.keys(weaponData.primaryWeapons); _i < _c.length; _i++) {
                var key = _c[_i];
                allPrimaryWeapons.push(weaponData.primaryWeapons[key]);
            }
            for (var _d = 0, _e = Object.keys(weaponData.secondaryWeapons); _d < _e.length; _d++) {
                var key = _e[_d];
                allSecondaryWeapons.push(weaponData.secondaryWeapons[key]);
            }
            for (var _f = 0, _g = Object.keys(weaponData.perks); _f < _g.length; _f++) {
                var key = _g[_f];
                allPerks.push(weaponData.perks[key]);
            }
            var primaryWeaponList = allPrimaryWeapons.filter(function (obj) {
                for (var i = 0; i < pilotData.pilots[pilotSelection].weapons.length; i++) {
                    if (obj.reference === pilotData.pilots[pilotSelection].weapons[i]) {
                        return obj;
                    }
                }
            });
            var secondaryWeaponList = allSecondaryWeapons.filter(function (obj) {
                for (var i = 0; i < pilotData.pilots[pilotSelection].subweapons.length; i++) {
                    if (obj.reference === pilotData.pilots[pilotSelection].subweapons[i]) {
                        return obj;
                    }
                }
            });
            var perkList = allPerks.filter(function (obj) {
                for (var i = 0; i < pilotData.pilots[pilotSelection].perks.length; i++) {
                    if (obj.reference === pilotData.pilots[pilotSelection].perks[i]) {
                        return obj;
                    }
                }
            });
            phaserMaster.forceLet('primaryWeaponList', primaryWeaponList);
            phaserMaster.forceLet('secondaryWeaponList', secondaryWeaponList);
            phaserMaster.forceLet('perkList', perkList);
            primaryWeaponList.map(function (obj, i) {
                var boxPadding = 5;
                var box = phaserSprites.addFromAtlas({ name: "box_pw_" + i, group: 'ui_loadout', y: container_2.y + 90, atlas: 'atlas', filename: "ui_box_unselected.png", alpha: 0 });
                box.anchor.setTo(0.5, 0.5);
                var gap = (box.width + boxPadding) / 2 * (primaryWeaponList.length - 1);
                box.x = (container_2.x + (i * box.width) + container_2.width / 2) - gap + (i * boxPadding);
                box.alpha = 1;
                var sbox = phaserSprites.addFromAtlas({ name: "sbox_pw_" + i, group: 'ui_box_selected', y: container_2.y + 90, atlas: 'atlas', filename: "ui_box_selected.png", alpha: 0 });
                sbox.anchor.setTo(0.5, 0.5);
                sbox.x = (container_2.x + (i * sbox.width) + container_2.width / 2) - gap + (i * boxPadding);
                sbox.alpha = 0;
                var icon = phaserSprites.addFromAtlas({ name: "icon_pw_" + i, group: 'ui_loadout', y: container_2.y + 90, atlas: 'atlas_weapons', filename: "" + obj.spriteIcon, alpha: 1 });
                icon.anchor.setTo(0.5, 0.5);
                icon.x = (container_2.x + (i * sbox.width) + container_2.width / 2) - gap + (i * boxPadding);
                phaserGroup.addMany(13, [box, sbox, icon]);
            });
            secondaryWeaponList.map(function (obj, i) {
                var boxPadding = 5;
                var box = phaserSprites.addFromAtlas({ name: "box_sw_" + i, group: 'ui_loadout', y: container_2.y + 140, atlas: 'atlas', filename: "ui_box_unselected.png", alpha: 0 });
                box.anchor.setTo(0.5, 0.5);
                var gap = (box.width + boxPadding) / 2 * (secondaryWeaponList.length - 1);
                box.x = (container_2.x + (i * box.width) + container_2.width / 2) - gap + (i * boxPadding);
                box.alpha = 1;
                var sbox = phaserSprites.addFromAtlas({ name: "sbox_sw_" + i, group: 'ui_box_selected', y: container_2.y + 140, atlas: 'atlas', filename: "ui_box_selected.png", alpha: 0 });
                sbox.anchor.setTo(0.5, 0.5);
                sbox.x = (container_2.x + (i * sbox.width) + container_2.width / 2) - gap + (i * boxPadding);
                sbox.alpha = 0;
                var icon = phaserSprites.addFromAtlas({ name: "icon_sw_" + i, group: 'ui_loadout', y: container_2.y + 140, atlas: 'atlas_weapons', filename: "" + obj.spriteIcon, alpha: 1 });
                icon.anchor.setTo(0.5, 0.5);
                icon.x = (container_2.x + (i * sbox.width) + container_2.width / 2) - gap + (i * boxPadding);
                phaserGroup.addMany(13, [box, sbox, icon]);
            });
            perkList.map(function (obj, i) {
                var boxPadding = 5;
                var box = phaserSprites.addFromAtlas({ name: "box_sp_" + i, group: 'ui_loadout', y: container_2.y + 190, atlas: 'atlas', filename: "ui_box_unselected.png", alpha: 0 });
                box.anchor.setTo(0.5, 0.5);
                var gap = (box.width + boxPadding) / 2 * (perkList.length - 1);
                box.x = (container_2.x + (i * box.width) + container_2.width / 2) - gap + (i * boxPadding);
                box.alpha = 1;
                var sbox = phaserSprites.addFromAtlas({ name: "sbox_sp_" + i, group: 'ui_box_selected', y: container_2.y + 190, atlas: 'atlas', filename: "ui_box_selected.png", alpha: 0 });
                sbox.anchor.setTo(0.5, 0.5);
                sbox.x = (container_2.x + (i * sbox.width) + container_2.width / 2) - gap + (i * boxPadding);
                sbox.alpha = 0;
                var icon = phaserSprites.addFromAtlas({ name: "icon_sp_" + i, group: 'ui_loadout', y: container_2.y + 190, atlas: 'atlas_weapons', filename: "" + obj.spriteIcon, alpha: 1 });
                icon.anchor.setTo(0.5, 0.5);
                icon.x = (container_2.x + (i * sbox.width) + container_2.width / 2) - gap + (i * boxPadding);
                phaserGroup.addMany(13, [box, sbox, icon]);
            });
            var loadoutCatagorySelector = phaserSprites.addFromAtlas({ name: "loadoutCatagorySelector", group: 'ui_loadout', atlas: 'atlas', filename: 'ui_pointer.png', visible: false, alpha: 0 });
            loadoutCatagorySelector.anchor.setTo(0.5, 0.5);
            loadoutCatagorySelector.show = function () {
                this.visible = true;
            };
            loadoutCatagorySelector.hide = function () {
                this.visible = false;
            };
            loadoutCatagorySelector.updateLocation = function (val) {
                var _a = phaserMaster.getAll(), primaryWeaponSelection = _a.primaryWeaponSelection, subWeaponSelection = _a.subWeaponSelection, perkSelection = _a.perkSelection;
                var box;
                if (val === 0) {
                    box = phaserSprites.get("box_pw_" + primaryWeaponSelection);
                    var x_1 = box.x, y_1 = box.y;
                    downarrow.updateLocation(x_1, y_1 - 30);
                }
                if (val === 1) {
                    box = phaserSprites.get("box_sw_" + subWeaponSelection);
                    var x_2 = box.x, y_2 = box.y;
                    downarrow.updateLocation(x_2, y_2 - 30);
                }
                if (val === 2) {
                    box = phaserSprites.get("box_sp_" + perkSelection);
                    var x_3 = box.x, y_3 = box.y;
                    downarrow.updateLocation(x_3, y_3 - 30);
                }
                var x = box.x, y = box.y;
                this.x = 40;
                this.y = y;
                this.visible;
            };
            var loadoutDescription = phaserSprites.addFromAtlas({ name: 'loadoutDescription', group: 'ui_loadout', atlas: 'atlas', filename: 'ui_descriptionbox_small.png', visible: false });
            loadoutDescription.anchor.setTo(0.5, 0.5);
            phaserSprites.centerOnPoint('loadoutDescription', container_2.width / 2 + loadoutDescription.width / 2, container_2.y + 310);
            var loadoutDescriptionText = phaserTexts.add({ name: 'loadoutDescriptionText', group: 'ui_loadout', x: loadoutDescription.x, y: loadoutDescription.y, font: 'gem', size: 14, default: "" });
            loadoutDescriptionText.anchor.setTo(0.5, 0.5);
            loadoutDescriptionText.maxWidth = loadoutDescription.width - padding * 2;
            phaserGroup.add(17, loadoutDescription);
            phaserGroup.add(18, loadoutDescriptionText);
        }
        function preloadComplete() {
            var game = phaserMaster.game();
            var pointer = phaserSprites.getOnly(['pointer']).pointer;
            var _a = phaserMaster.getOnly(['currentSelection', 'pilotSelection']), currentSelection = _a.currentSelection, pilotSelection = _a.pilotSelection;
            pointer.updateLocation(currentSelection);
            updateProfileSelection(pilotSelection);
            updateWeaponSelected();
            overlayControls('WIPEOUT', function () {
                utilityManager.overlayBGControls({ transition: 'FADEOUT', delay: 0, speed: 250 }, function () {
                    phaserMaster.changeState('MAINMENU');
                });
            });
        }
        function overlayControls(transition, callback) {
            if (callback === void 0) { callback = function () { }; }
            utilityManager.overlayControls({ transition: transition, delay: 1, speed: 250, tileDelay: 10 }, callback);
        }
        function fireBullet() {
            var game = phaserMaster.game();
            var ship = phaserSprites.getOnly(['ship']).ship;
            var _a = { gap: 10, shots: 2 }, gap = _a.gap, shots = _a.shots;
            var centerShots = (gap * (shots - 1)) / 2;
            ship.fireWeapon();
            var _loop_1 = function (i) {
                setTimeout(function () {
                    weaponManager.createBullet({ name: "bullet_" + game.rnd.integer(), group: 'ship_wpn_preview', x: ship.x + (i * gap) - centerShots, y: ship.y, spread: 0, layer: 7 });
                }, 25);
            };
            for (var i = 0; i < shots; i++) {
                _loop_1(i);
            }
        }
        function fireLasers() {
            var game = phaserMaster.game();
            var ship = phaserSprites.getOnly(['ship']).ship;
            var _a = { gap: 30, shots: 1 }, gap = _a.gap, shots = _a.shots;
            var centerShots = (gap * (shots - 1)) / 2;
            ship.fireWeapon();
            for (var i = 0; i < shots; i++) {
                weaponManager.createLaser({ name: "laser_" + game.rnd.integer(), group: 'ship_wpn_preview', x: ship.x + (i * gap) - centerShots, y: ship.y - ship.height / 2, spread: 0, layer: 7 });
            }
        }
        function fireMissles() {
            var game = phaserMaster.game();
            var ship = phaserSprites.getOnly(['ship']).ship;
            var _a = { gap: 30, shots: 2 }, gap = _a.gap, shots = _a.shots;
            var centerShots = (gap * (shots - 1)) / 2;
            ship.fireWeapon();
            for (var i = 0; i < shots; i++) {
                weaponManager.createMissle({ name: "missle_" + game.rnd.integer(), group: 'ship_wpn_preview', x: ship.x + (i * gap) - centerShots, y: ship.y - ship.height / 2, spread: (i % 2 === 0 ? -0.50 : 0.50), layer: 7 });
            }
        }
        function createClusterbomb() {
            var game = phaserMaster.game();
            var ship = phaserSprites.getOnly(['ship']).ship;
            var onDestroy = function (obj) {
                for (var i = 0; i < obj.bomblets; i++) {
                    createBomblet({
                        x: obj.x,
                        y: obj.y,
                        ix: game.rnd.integerInRange(-400, 400),
                        iy: game.rnd.integerInRange(-400, 100),
                        damage: obj.damageAmount / 4,
                        group: 'ship_wpn_preview',
                        layer: 2
                    });
                }
            };
            ship.fireSubweapon();
            weaponManager.createClusterbomb({ name: "clusterbomb_" + game.rnd.integer(), group: 'ship_wpn_preview', x: ship.x - 22, y: ship.y, layer: 2 }, onDestroy);
        }
        function createBomblet(options) {
            var onDestroy = function (obj) { createExplosion(obj.x, obj.y, 0.5, options.layer + 1); };
            var bomblet = weaponManager.createBomblet(options, onDestroy);
        }
        function createExplosion(x, y, scale, layer) {
            weaponManager.createExplosion(x, y, scale, layer);
        }
        function createTriplebomb() {
            var game = phaserMaster.game();
            var ship = phaserSprites.getOnly(['ship']).ship;
            for (var i = 0; i < 3; i++) {
                setTimeout(function () {
                    ship.fireSubweapon();
                    weaponManager.createTriplebomb({ name: "triplebomb_" + game.rnd.integer(), group: 'ship_wpn_preview', x: ship.x + 20, y: ship.y, layer: 2 });
                }, i * 300);
            }
        }
        function createTurret() {
            var game = phaserMaster.game();
            var ship = phaserSprites.getOnly(['ship']).ship;
            var onInit = function (obj) {
                var _a = { gap: 10, shots: 3 }, gap = _a.gap, shots = _a.shots;
                var centerShots = (gap * (shots - 1)) / 2;
                obj.fireInterval = setInterval(function () {
                    for (var i = 0; i < shots; i++) {
                        weaponManager.createBullet({ name: "bullet_" + game.rnd.integer(), group: 'ship_wpn_preview', x: obj.x + (i * gap) - centerShots, y: obj.y, spread: 0, layer: 2 });
                    }
                }, 200);
                obj.fireInterval;
            };
            var onUpdate = function (obj) {
                obj.x = ship.x - obj.offset;
                obj.y = ship.y;
            };
            var onDestroy = function (obj) { };
            weaponManager.createTurret({ name: "turret_" + game.rnd.integer(), group: 'ship_wpn_preview', x: ship.x, y: ship.y, offset: 50, layer: 3 }, onInit, onDestroy, onUpdate);
            weaponManager.createTurret({ name: "turret_" + game.rnd.integer(), group: 'ship_wpn_preview', x: ship.x, y: ship.y, offset: -50, layer: 3 }, onInit, onDestroy, onUpdate);
        }
        function playLoadoutPreview(type) {
            var game = phaserMaster.game();
            var _a = phaserMaster.getAll(), primaryWeaponList = _a.primaryWeaponList, primaryWeaponSelection = _a.primaryWeaponSelection, loadoutSelection = _a.loadoutSelection, secondaryWeaponList = _a.secondaryWeaponList, subWeaponSelection = _a.subWeaponSelection, perkSelection = _a.perkSelection;
            var ship = phaserSprites.getAll('OBJECT').ship;
            if (type === 'PRIMARY') {
                switch (primaryWeaponList[primaryWeaponSelection].reference) {
                    case 'BULLET':
                        fireBullet();
                        break;
                    case 'LASER':
                        fireLasers();
                        break;
                    case 'MISSLE':
                        fireMissles();
                        break;
                }
            }
            if (type === 'SECONDARY') {
                phaserSprites.getGroup('ship_wpn_preview').map(function (obj) {
                    obj.destroyIt();
                });
                switch (secondaryWeaponList[subWeaponSelection].reference) {
                    case 'CLUSTERBOMB':
                        createClusterbomb();
                        break;
                    case 'TRIPLEBOMB':
                        createTriplebomb();
                        break;
                    case 'TURRET':
                        createTurret();
                        break;
                    case 'BLASTRADIUS':
                        break;
                }
            }
        }
        function updateWeaponSelected() {
            var _a = phaserMaster.getAll(), primaryWeaponSelection = _a.primaryWeaponSelection, subWeaponSelection = _a.subWeaponSelection, perkSelection = _a.perkSelection;
            phaserSprites.getGroup('ui_box_selected').map(function (obj) {
                obj.alpha = 0;
            });
            phaserSprites.get("sbox_pw_" + primaryWeaponSelection).alpha = 1;
            phaserSprites.get("sbox_sw_" + subWeaponSelection).alpha = 1;
            phaserSprites.get("sbox_sp_" + perkSelection).alpha = 1;
        }
        function updateProfileSelection(val) {
            var _a = phaserSprites.getOnly(['profileSelector', 'loadoutCatagorySelector', 'container_3']), profileSelector = _a.profileSelector, loadoutCatagorySelector = _a.loadoutCatagorySelector, container_3 = _a.container_3;
            var pilotDescriptionText = phaserTexts.getOnly(['pilotDescriptionText']).pilotDescriptionText;
            phaserMaster.forceLet('primaryWeaponSelection', 0);
            phaserMaster.forceLet('subWeaponSelection', 0);
            phaserMaster.forceLet('perkSelection', 0);
            if (phaserSprites.get('ship') !== undefined) {
                playerManager.destroyShip('ship');
            }
            buildLoadout(val);
            profileSelector.updateLocation(val);
            pilotDescriptionText.updateThisText(val);
            updateWeaponSelected();
            var _b = phaserMaster.getOnly(['primaryWeaponSelection', 'primaryWeaponList', 'secondaryWeaponList', 'subWeaponSelection', 'perkSelection', 'perkList']), primaryWeaponSelection = _b.primaryWeaponSelection, primaryWeaponList = _b.primaryWeaponList, secondaryWeaponList = _b.secondaryWeaponList, subWeaponSelection = _b.subWeaponSelection, perkSelection = _b.perkSelection, perkList = _b.perkList;
            var ship = playerManager.createShip({ name: 'ship', group: 'playership', shipId: val, layer: 5 });
            ship.attachPerk(perkList[perkSelection].reference);
            ship.attachWeapon(primaryWeaponList[primaryWeaponSelection].reference);
            ship.attachSubweapon(secondaryWeaponList[subWeaponSelection].reference);
            ship.visible = true;
            phaserSprites.centerOnPoint('ship', container_3.x + container_3.width / 2 + ship.width / 2, container_3.height - 100);
        }
        function updateLoadoutCatagory(val) {
            var loadoutSelection = phaserMaster.getAll().loadoutSelection;
            var _a = phaserSprites.getAll('OBJECT'), downarrow = _a.downarrow, loadoutCatagorySelector = _a.loadoutCatagorySelector;
            loadoutSelection += val;
            if (val > 0) {
                if (loadoutSelection > 2) {
                    loadoutSelection = 2;
                }
            }
            if (val < 0) {
                if (loadoutSelection < 0) {
                    loadoutSelection = 0;
                }
            }
            phaserMaster.forceLet('loadoutSelection', loadoutSelection);
            loadoutItemSelector(null);
            loadoutCatagorySelector.updateLocation(loadoutSelection);
        }
        function loadoutItemSelector(val) {
            var _a = phaserMaster.getOnly(['weaponData', 'loadoutSelection', 'primaryWeaponSelection', 'subWeaponSelection', 'perkSelection', 'primaryWeaponList', 'secondaryWeaponList', 'perkList']), weaponData = _a.weaponData, loadoutSelection = _a.loadoutSelection, primaryWeaponSelection = _a.primaryWeaponSelection, subWeaponSelection = _a.subWeaponSelection, perkSelection = _a.perkSelection, primaryWeaponList = _a.primaryWeaponList, secondaryWeaponList = _a.secondaryWeaponList, perkList = _a.perkList;
            var _b = phaserSprites.getOnly(['downarrow', 'loadoutCatagorySelector', 'ship']), downarrow = _b.downarrow, loadoutCatagorySelector = _b.loadoutCatagorySelector, ship = _b.ship;
            var loadoutDescriptionText = phaserTexts.getOnly(['loadoutDescriptionText']).loadoutDescriptionText;
            switch (loadoutSelection) {
                case 0:
                    primaryWeaponSelection += val;
                    if (val > 0) {
                        if (primaryWeaponSelection >= primaryWeaponList.length) {
                            primaryWeaponSelection = 0;
                        }
                        phaserMaster.forceLet('primaryWeaponSelection', primaryWeaponSelection);
                    }
                    if (val < 0) {
                        if (primaryWeaponSelection < 0) {
                            primaryWeaponSelection = primaryWeaponList.length - 1;
                        }
                        phaserMaster.forceLet('primaryWeaponSelection', primaryWeaponSelection);
                    }
                    loadoutDescriptionText.setText(primaryWeaponList[primaryWeaponSelection].name + ": " + primaryWeaponList[primaryWeaponSelection].description);
                    break;
                case 1:
                    subWeaponSelection += val;
                    if (val > 0) {
                        if (subWeaponSelection >= secondaryWeaponList.length) {
                            subWeaponSelection = 0;
                        }
                        phaserMaster.forceLet('subWeaponSelection', subWeaponSelection);
                    }
                    if (val < 0) {
                        if (subWeaponSelection < 0) {
                            subWeaponSelection = secondaryWeaponList.length - 1;
                        }
                        phaserMaster.forceLet('subWeaponSelection', subWeaponSelection);
                    }
                    loadoutDescriptionText.setText(secondaryWeaponList[subWeaponSelection].name + ": " + secondaryWeaponList[subWeaponSelection].description);
                    break;
                case 2:
                    perkSelection += val;
                    if (val > 0) {
                        if (perkSelection >= perkList.length) {
                            perkSelection = 0;
                        }
                        phaserMaster.forceLet('perkSelection', perkSelection);
                    }
                    if (val < 0) {
                        if (perkSelection < 0) {
                            perkSelection = perkList.length - 1;
                        }
                        phaserMaster.forceLet('perkSelection', perkSelection);
                    }
                    loadoutDescriptionText.setText(perkList[perkSelection].name + ": " + perkList[perkSelection].description);
                    break;
            }
            ship.attachPerk(perkList[perkSelection].reference);
            ship.attachWeapon(primaryWeaponList[primaryWeaponSelection].reference);
            ship.attachSubweapon(secondaryWeaponList[subWeaponSelection].reference);
            var box;
            if (loadoutSelection === 0) {
                box = phaserSprites.get("box_pw_" + primaryWeaponSelection);
                var x = box.x, y = box.y;
                downarrow.updateLocation(x, y - 30);
            }
            if (loadoutSelection === 1) {
                box = phaserSprites.get("box_sw_" + subWeaponSelection);
                var x = box.x, y = box.y;
                downarrow.updateLocation(x, y - 30);
            }
            if (loadoutSelection === 2) {
                box = phaserSprites.get("box_sp_" + perkSelection);
                var x = box.x, y = box.y;
                downarrow.updateLocation(x, y - 30);
            }
            updateWeaponSelected();
            loadoutCatagorySelector.updateLocation(loadoutSelection);
        }
        function returnSizeOfObject(obj) {
            var size = 0;
            for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
                var key = _a[_i];
                size++;
            }
            return size;
        }
        function update() {
            var game = phaserMaster.game();
            var _a = phaserMaster.getAll(), currentSelection = _a.currentSelection, pilotSelection = _a.pilotSelection, loadoutSelection = _a.loadoutSelection, primaryWeaponList = _a.primaryWeaponList, primaryWeaponSelection = _a.primaryWeaponSelection, secondaryWeaponList = _a.secondaryWeaponList, subWeaponSelection = _a.subWeaponSelection;
            var _b = phaserSprites.getAll(), profileSelector = _b.profileSelector, loadoutCatagorySelector = _b.loadoutCatagorySelector, pointer = _b.pointer, downarrow = _b.downarrow, loadoutDescription = _b.loadoutDescription;
            var _c = phaserControls.getOnly(['DOWN', 'UP', 'LEFT', 'RIGHT', 'A', 'START']), DOWN = _c.DOWN, UP = _c.UP, LEFT = _c.LEFT, RIGHT = _c.RIGHT;
            var loadoutDescriptionText = phaserTexts.getAll('OBJECT').loadoutDescriptionText;
            var delay = 0;
            phaserSprites.getManyGroups(['ui_bg', 'playership', 'ship_wpn_preview']).map(function (obj) {
                obj.onUpdate();
            });
            if (phaserControls.checkWithDelay({ isActive: true, key: 'BACK', delay: 250 })) {
                if (currentSelection === 2) {
                    pointer.updateLocation(0);
                }
            }
            if (phaserControls.checkWithDelay({ isActive: true, key: 'START', delay: 250 })) {
                if (currentSelection !== 2) {
                    phaserMaster.forceLet('loadoutSelection', 0);
                    pointer.show();
                    downarrow.hide();
                    loadoutDescription.hide();
                    loadoutDescriptionText.hide();
                    loadoutCatagorySelector.hide();
                    phaserMaster.changeState('MAINMENU');
                    pointer.updateLocation(2);
                }
                if (currentSelection === 2) {
                    pointer.hide();
                    phaserMaster.forceLet('currentSelection', null);
                    utilityManager.overlayBGControls({ transition: 'FADEIN', delay: 0, speed: 250 }, function () {
                        overlayControls('WIPEIN', function () {
                            setTimeout(function () {
                                startGame();
                            }, 1000);
                        });
                    });
                }
            }
            if (phaserMaster.checkState('MAINMENU')) {
                if (phaserControls.checkWithDelay({ isActive: true, key: 'UP', delay: 250 })) {
                    if (currentSelection !== 2) {
                        pointer.updateLocation(0);
                    }
                }
                if (phaserControls.checkWithDelay({ isActive: true, key: 'DOWN', delay: 250 })) {
                    if (currentSelection === 1) {
                        pointer.hide();
                        downarrow.show();
                        loadoutDescription.show();
                        loadoutDescriptionText.show();
                        loadoutCatagorySelector.show();
                        loadoutCatagorySelector.updateLocation(loadoutSelection);
                        loadoutItemSelector(loadoutSelection);
                        phaserMaster.changeState('LOADOUTSELECT');
                    }
                    if (currentSelection !== 2) {
                        pointer.updateLocation(1);
                    }
                }
                if (phaserControls.checkWithDelay({ isActive: true, key: 'RIGHT', delay: 250 })) {
                    if (currentSelection === 0) {
                        profileSelector.inc();
                    }
                }
                if (phaserControls.checkWithDelay({ isActive: true, key: 'LEFT', delay: 250 })) {
                    if (currentSelection === 0) {
                        profileSelector.dec();
                    }
                }
                if (phaserControls.checkWithDelay({ isActive: true, key: 'A', delay: 250 })) {
                    if (currentSelection === 2) {
                        pointer.hide();
                        phaserMaster.forceLet('currentSelection', null);
                        overlayControls('FADEIN');
                    }
                }
            }
            if (phaserMaster.checkState('PILOTSELECT')) {
                if (phaserControls.checkWithDelay({ isActive: true, key: 'LEFT', delay: 250 })) {
                    profileSelector.dec();
                }
                if (phaserControls.checkWithDelay({ isActive: true, key: 'RIGHT', delay: 250 })) {
                    profileSelector.inc();
                }
                if (phaserControls.checkWithDelay({ isActive: true, key: 'A', delay: 250 })) {
                    downarrow.hide();
                    pointer.show();
                    phaserMaster.changeState('MAINMENU');
                }
            }
            if (phaserMaster.checkState('LOADOUTSELECT')) {
                if (loadoutSelection === 0 && phaserControls.checkWithDelay({ isActive: false, key: 'R3', delay: primaryWeaponList[primaryWeaponSelection].cooldown })) {
                    playLoadoutPreview('PRIMARY');
                }
                if (loadoutSelection === 1 && phaserControls.checkWithDelay({ isActive: false, key: 'R3', delay: 2000 })) {
                    playLoadoutPreview('SECONDARY');
                }
                if (phaserControls.checkWithDelay({ isActive: true, key: 'DOWN', delay: 250 })) {
                    updateLoadoutCatagory(1);
                }
                if (phaserControls.checkWithDelay({ isActive: true, key: 'UP', delay: 250 })) {
                    if (loadoutSelection === 0) {
                        phaserMaster.forceLet('loadoutSelection', 0);
                        pointer.show();
                        downarrow.hide();
                        loadoutDescription.hide();
                        loadoutDescriptionText.hide();
                        loadoutCatagorySelector.hide();
                        phaserMaster.changeState('MAINMENU');
                    }
                    else {
                        updateLoadoutCatagory(-1);
                    }
                }
                if (phaserControls.checkWithDelay({ isActive: true, key: 'RIGHT', delay: 250 })) {
                    loadoutItemSelector(1);
                }
                if (phaserControls.checkWithDelay({ isActive: true, key: 'LEFT', delay: 250 })) {
                    loadoutItemSelector(-1);
                }
                if (phaserControls.checkWithDelay({ isActive: true, key: 'BACK', delay: 250 })) {
                    phaserMaster.forceLet('loadoutSelection', 0);
                    pointer.show();
                    downarrow.hide();
                    loadoutDescription.hide();
                    loadoutDescriptionText.hide();
                    loadoutCatagorySelector.hide();
                    phaserMaster.changeState('MAINMENU');
                }
            }
        }
        function startGame() {
            var game = phaserMaster.game();
            var _a = phaserMaster.getAll(), primaryWeaponList = _a.primaryWeaponList, primaryWeaponSelection = _a.primaryWeaponSelection, loadoutSelection = _a.loadoutSelection, secondaryWeaponList = _a.secondaryWeaponList, subWeaponSelection = _a.subWeaponSelection, perkList = _a.perkList, perkSelection = _a.perkSelection, pilotSelection = _a.pilotSelection;
            saveData('pilot', pilotSelection);
            saveData('primaryWeapon', primaryWeaponList[primaryWeaponSelection].reference);
            saveData('secondaryWeapon', secondaryWeaponList[subWeaponSelection].reference);
            saveData('perk', perkList[perkSelection].reference);
            updateStore();
            parent.startGame();
        }
        function end() {
            parent.test();
        }
        parent.game = this;
        this.game = phaserMaster.game();
    };
    PhaserGameObject.prototype.destroy = function () {
        this.game.destroy();
    };
    return PhaserGameObject;
}());
var __phaser = new PhaserGameObject();
var PHASER_AUDIO = (function () {
    function PHASER_AUDIO() {
    }
    return PHASER_AUDIO;
}());
var PHASER_BITMAPDATA_MANAGER = (function () {
    function PHASER_BITMAPDATA_MANAGER() {
        this.game = null;
        this.bmd = {
            array: [],
            object: {}
        };
    }
    PHASER_BITMAPDATA_MANAGER.prototype.assign = function (game) {
        this.game = game;
    };
    PHASER_BITMAPDATA_MANAGER.prototype.addGradient = function (params) {
        var duplicateCheck = this.bmd.array.filter(function (obj) {
            return obj.name === params.name;
        });
        if (duplicateCheck.length === 0) {
            var tempBmd = this.game.make.bitmapData(params.width, params.height);
            var grd = tempBmd.context.createLinearGradient(0, 0, 0, params.height);
            grd.addColorStop(0, params.start);
            grd.addColorStop(1, params.end);
            tempBmd.context.fillStyle = grd;
            tempBmd.context.fillRect(0, 0, params.width, params.height);
            var cacheRef = this.game.cache.addBitmapData(params.name, tempBmd);
            var newBmd = this.game.make.bitmapData();
            newBmd.load(this.game.cache.getBitmapData(params.name));
            if (params.render) {
                newBmd.addToWorld(params.x, params.y);
            }
            newBmd.name = params.name;
            newBmd.group = params.group;
            newBmd.cacheBitmapData = cacheRef;
            this.bmd.array.push(newBmd);
            this.bmd.object[params.name] = newBmd;
            return newBmd;
        }
        else {
            console.log("Duplicate key name not allowed: " + params.name);
        }
    };
    PHASER_BITMAPDATA_MANAGER.prototype.addImage = function (params) {
        var duplicateCheck = this.bmd.array.filter(function (obj) {
            return obj.name === params.name;
        });
        if (duplicateCheck.length === 0) {
            var newBmd = this.game.make.bitmapData();
            newBmd.load(params.reference);
            newBmd.addToWorld(params.x, params.y);
            if (!params.render) {
                newBmd.cls();
            }
            newBmd.name = params.name;
            newBmd.group = params.group;
            newBmd.cacheBitmapData = params.reference;
            this.bmd.array.push(newBmd);
            this.bmd.object[params.name] = newBmd;
            return newBmd;
        }
        else {
            console.log("Duplicate key name not allowed: " + params.name);
        }
    };
    PHASER_BITMAPDATA_MANAGER.prototype.addEmpty = function (params) {
        var duplicateCheck = this.bmd.array.filter(function (obj) {
            return obj.name === params.name;
        });
        if (duplicateCheck.length === 0) {
            var newBmd = this.game.make.bitmapData(params.width, params.height);
            newBmd.addToWorld(params.x, params.y);
            if (!params.render) {
                newBmd.cls();
            }
            newBmd.name = params.name;
            newBmd.group = params.group;
            this.bmd.array.push(newBmd);
            this.bmd.object[params.name] = newBmd;
            return newBmd;
        }
        else {
            console.log("Duplicate key name not allowed: " + params.name);
        }
    };
    PHASER_BITMAPDATA_MANAGER.prototype.destroy = function (name) {
        var deleted = [];
        var destroyArray = this.bmd.array.filter(function (item) {
            return item.name === name;
        });
        for (var _i = 0, destroyArray_1 = destroyArray; _i < destroyArray_1.length; _i++) {
            var obj = destroyArray_1[_i];
            deleted.push(obj.name);
            obj.destroy();
        }
        delete this.bmd.object[name];
        this.bmd.array = this.bmd.array.filter(function (item) {
            return item.name !== name;
        });
        return deleted;
    };
    PHASER_BITMAPDATA_MANAGER.prototype.destroyGroup = function (key) {
        var deleted = [];
        var destroyArray = this.bmd.array.filter(function (item) {
            return item.group === name;
        });
        for (var _i = 0, destroyArray_2 = destroyArray; _i < destroyArray_2.length; _i++) {
            var obj = destroyArray_2[_i];
            deleted.push(obj.name);
            obj.destroy();
        }
        delete this.bmd.object[name];
        this.bmd.array = this.bmd.array.filter(function (item) {
            return item.group !== name;
        });
        return deleted;
    };
    PHASER_BITMAPDATA_MANAGER.prototype.get = function (name) {
        return this.bmd.object[name];
    };
    PHASER_BITMAPDATA_MANAGER.prototype.getGroup = function (name) {
        return this.bmd.array.filter(function (item) {
            return item.group === name;
        });
    };
    PHASER_BITMAPDATA_MANAGER.prototype.getAll = function (type) {
        if (type === void 0) { type = 'BOTH'; }
        if (type === 'ARRAY') {
            return this.bmd.array;
        }
        if (type == 'OBJECT') {
            return this.bmd.object;
        }
        return { object: this.bmd.object, array: this.bmd.array };
    };
    PHASER_BITMAPDATA_MANAGER.prototype.takeSnapshot = function () {
        return this.game.canvas.toDataURL();
    };
    return PHASER_BITMAPDATA_MANAGER;
}());
var PHASER_BUTTON_MANAGER = (function () {
    function PHASER_BUTTON_MANAGER() {
        this.game = null;
        this.resources = {
            array: [],
            object: {}
        };
    }
    PHASER_BUTTON_MANAGER.prototype.assign = function (game) {
        this.game = game.game;
    };
    PHASER_BUTTON_MANAGER.prototype.add = function (params) {
        var duplicateCheck = this.resources.array.filter(function (sprite) {
            return sprite.name === params.name;
        });
        if (duplicateCheck.length === 0) {
            var newSprite = this.game.add.button(params.x, params.y, params.reference, params.onclick);
            newSprite.name = params.name;
            newSprite.group = params.group || null;
            this.resources.array.push(newSprite);
            this.resources.object[params.name] = newSprite;
            return newSprite;
        }
        else {
            console.log("Duplicate key name not allowed: " + params.name);
        }
    };
    PHASER_BUTTON_MANAGER.prototype.destroy = function (key) {
        var keys = [];
        var deleteSpriteArray = this.resources.array.filter(function (sprite) {
            return sprite.key === key;
        });
        for (var _i = 0, deleteSpriteArray_1 = deleteSpriteArray; _i < deleteSpriteArray_1.length; _i++) {
            var sprite = deleteSpriteArray_1[_i];
            keys.push(sprite.key);
            sprite.destroy();
        }
        delete this.resources.object[key];
        this.resources.array = this.resources.array.filter(function (sprite) {
            return sprite.key !== key;
        });
        return keys;
    };
    PHASER_BUTTON_MANAGER.prototype.destroyGroup = function (group) {
        var keys = [];
        var deleteSpriteArray = this.resources.array.filter(function (sprite) {
            return sprite.group === group;
        });
        for (var _i = 0, deleteSpriteArray_2 = deleteSpriteArray; _i < deleteSpriteArray_2.length; _i++) {
            var sprite = deleteSpriteArray_2[_i];
            keys.push(sprite.key);
            sprite.destroy();
        }
        delete this.resources.object[group];
        this.resources.array = this.resources.array.filter(function (sprite) {
            return sprite.group !== group;
        });
        return keys;
    };
    PHASER_BUTTON_MANAGER.prototype.get = function (key) {
        return this.resources.object[key];
    };
    PHASER_BUTTON_MANAGER.prototype.getGroup = function (key) {
        return this.resources.array.filter(function (sprite) {
            return sprite.group === key;
        });
    };
    PHASER_BUTTON_MANAGER.prototype.getAll = function (type) {
        if (type === void 0) { type = 'BOTH'; }
        if (type === 'ARRAY') {
            return this.resources.array;
        }
        if (type == 'OBJECT') {
            return this.resources.object;
        }
        return { object: this.resources.object, array: this.resources.array };
    };
    return PHASER_BUTTON_MANAGER;
}());
var PHASER_CONTROLS = (function () {
    function PHASER_CONTROLS() {
        this.IO = null;
        this.game = null;
        this.buttonSensitivity = { QUICK: 1, SHORT: 50, LONG: 150, SUPERLONG: 300 };
        this.releasedKeys = [];
        this.properties = {
            isReady: false,
            allowDebugger: true,
            buttonDelay: 50,
            timingRefreshRate: 1
        };
        this.directionalButtons = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        this.actionButtons = ['A', 'B', 'X', 'Y'];
        this.triggerButtons = ['L1', 'L2', 'R1', 'R2', 'L3', 'R3'];
        this.systemButtons = ['START', 'BACK'];
        this.buttonArray = this.directionalButtons.concat(this.actionButtons, this.triggerButtons, this.systemButtons);
        this.buttonMap = {
            UP: { name: 'UP', code: 'ArrowUp' },
            DOWN: { name: 'DOWN', code: 'ArrowDown' },
            LEFT: { name: 'LEFT', code: 'ArrowLeft' },
            RIGHT: { name: 'RIGHT', code: 'ArrowRight' },
            A: { name: 'A', code: 'KeyA' },
            B: { name: 'S', code: 'KeyS' },
            X: { name: 'D', code: 'KeyD' },
            Y: { name: 'F', code: 'KeyF' },
            L1: { name: 'Q', code: 'KeyQ' },
            L2: { name: 'W', code: 'KeyW' },
            R1: { name: 'E', code: 'KeyE' },
            R2: { name: 'R', code: 'KeyR' },
            L3: { name: 'O', code: 'KeyO' },
            R3: { name: 'P', code: 'KeyP' },
            START: { name: 'ENTER', code: 'Enter' },
            BACK: { name: 'BACKSPACE', code: 'Backspace' },
        };
        this.buttonMapId = {
            UP: 1,
            DOWN: 2,
            LEFT: 3,
            RIGHT: 4,
            A: 5,
            B: 6,
            X: 7,
            Y: 8,
            L1: 9,
            L2: 10,
            R1: 11,
            R2: 12,
            L3: 13,
            R3: 14,
            START: 15,
            BACK: 16,
        };
        this.disabledButtons = {
            ALL: false,
            DIRECTIONAL: false,
            TRIGGER: false,
            ACTION: false,
            SYSTEM: false
        };
        this.debugger = {
            enabled: false,
            text: {}
        };
        this.inputDelay = {
            delay: Array.apply(null, Array(20)).map(function () { return 0; })
        };
    }
    PHASER_CONTROLS.prototype.assign = function (game) {
        var _this = this;
        this.game = game;
        var style = { font: "12px Courier New", fill: "#fff", align: "left" };
        this.buttonArray.forEach(function (btn, index) {
            _this.debugger.text[btn] = null;
            _this.debugger.text[btn] = game.add.text(10, 10 + (index * 15), "", style);
            _this.disabledButtons[btn] = false;
        });
        var IO = {
            buttons: {},
            sensitivityPress: {},
            sensitivityBuffer: {},
            state: {}
        };
        var _loop_2 = function (btn) {
            IO.buttons[btn] = game.input.keyboard.addKey(Phaser.Keyboard[this_1.buttonMap[btn].name]);
            IO.sensitivityPress[btn] = null;
            IO.sensitivityBuffer[btn] = 0;
            IO.state[btn] = function () {
                return _this.getBtnPressType(_this.IO.sensitivityBuffer[btn]);
            };
        };
        var this_1 = this;
        for (var _i = 0, _a = this.buttonArray; _i < _a.length; _i++) {
            var btn = _a[_i];
            _loop_2(btn);
        }
        var _loop_3 = function (btn) {
            IO.buttons[btn].onDown.add(function (e) {
                clearInterval(IO.sensitivityPress[btn]);
                var btnType, btnName;
                var buttonTypes = ['DIRECTIONAL', 'ACTION', 'TRIGGER', 'SYSTEM'];
                Object.keys(_this.buttonMap).forEach(function (key, value) {
                    if (_this.buttonMap[key].code === e.event.code) {
                        for (var _i = 0, buttonTypes_1 = buttonTypes; _i < buttonTypes_1.length; _i++) {
                            var _type = buttonTypes_1[_i];
                            if (_this[_type.toLowerCase() + "Buttons"].indexOf(key) + 1) {
                                btnType = _type;
                                btnName = key;
                            }
                        }
                    }
                });
                var isDisabled = false;
                if (_this.disabledButtons.ALL) {
                    isDisabled = true;
                }
                for (var _i = 0, buttonTypes_2 = buttonTypes; _i < buttonTypes_2.length; _i++) {
                    var name_1 = buttonTypes_2[_i];
                    if (_this.disabledButtons[name_1] && btnType === name_1) {
                        isDisabled = true;
                    }
                }
                Object.keys(_this.buttonMap).forEach(function (key, value) {
                    if (_this.disabledButtons[key] && btnName === key) {
                        isDisabled = true;
                    }
                });
                if (!isDisabled) {
                    IO.sensitivityPress[btn] = setInterval(function () {
                        IO.sensitivityBuffer[btn] += 1;
                    }, _this.properties.timingRefreshRate);
                }
            }, this_2);
        };
        var this_2 = this;
        for (var _b = 0, _c = this.buttonArray; _b < _c.length; _b++) {
            var btn = _c[_b];
            _loop_3(btn);
        }
        game.input.keyboard.onUpCallback = function (e) {
            for (var _i = 0, _a = _this.buttonArray; _i < _a.length; _i++) {
                var btn = _a[_i];
                if (e.code === _this.buttonMap[btn].code) {
                    _this.releasedKeys.push(_this.buttonMap[btn].code);
                    setTimeout(function () {
                        _this.releasedKeys.shift();
                    }, 1500);
                    clearInterval(IO.sensitivityPress[btn]);
                    IO.sensitivityBuffer[btn] = 0;
                }
            }
            if (e.code === 'Backquote' && _this.properties.allowDebugger) {
                _this.setDebugger(!_this.debugger.enabled);
                _this.updateDebugger();
            }
        };
        this.properties.isReady = true;
        this.IO = IO;
        return IO;
    };
    PHASER_CONTROLS.prototype.mapKeys = function (map) {
        var _this = this;
        this.properties.isReady = false;
        this.destroyAll();
        setTimeout(function () {
            _this.buttonMap = map;
            _this.properties.isReady = true;
            _this.assign(_this.game);
        }, 1);
    };
    PHASER_CONTROLS.prototype.isReady = function () {
        return this.properties.isReady;
    };
    PHASER_CONTROLS.prototype.checkWithDelay = function (params) {
        if (this.read(params.key).active === params.isActive) {
            if (this.game.time.now > this.inputDelay.delay[this.getKeyId(params.key)]) {
                this.inputDelay.delay[this.getKeyId(params.key)] = params.delay + this.game.time.now;
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    };
    PHASER_CONTROLS.prototype.isDebuggerEnabled = function () {
        return this.debugger.enabled;
    };
    PHASER_CONTROLS.prototype.setDebugger = function (state) {
        if (state === void 0) { state = true; }
        this.debugger.enabled = state;
    };
    PHASER_CONTROLS.prototype.updateDebugger = function () {
        if (this.properties.isReady) {
            for (var _i = 0, _a = this.buttonArray; _i < _a.length; _i++) {
                var btn = _a[_i];
                this.debugger.text[btn].setText(this.debugger.enabled ? this.debuggerString(btn) : '').bringToTop();
            }
        }
    };
    PHASER_CONTROLS.prototype.disableAllInput = function () {
        this.disabledButtons.ALL = true;
    };
    PHASER_CONTROLS.prototype.enableAllInput = function () {
        this.disabledButtons.ALL = false;
    };
    PHASER_CONTROLS.prototype.disableAllDirectionalButtons = function () {
        this.disabledButtons.DIRECTIONAL = true;
    };
    PHASER_CONTROLS.prototype.enableAllDirectionalButtons = function () {
        this.disabledButtons.DIRECTIONAL = false;
    };
    PHASER_CONTROLS.prototype.disableAllTriggerButtons = function () {
        this.disabledButtons.TRIGGER = true;
    };
    PHASER_CONTROLS.prototype.enableAllTriggerButtons = function () {
        this.disabledButtons.TRIGGER = false;
    };
    PHASER_CONTROLS.prototype.disableAllActionButtons = function () {
        this.disabledButtons.ACTION = true;
    };
    PHASER_CONTROLS.prototype.enableAllActionButtons = function () {
        this.disabledButtons.ACTION = false;
    };
    PHASER_CONTROLS.prototype.disableAllSystemButtons = function () {
        this.disabledButtons.SYSTEM = true;
    };
    PHASER_CONTROLS.prototype.enableAllSystemButtons = function () {
        this.disabledButtons.SYSTEM = false;
    };
    PHASER_CONTROLS.prototype.setDisableKeyProperty = function (name, value) {
        if (value === void 0) { value = true; }
        if (this.properties.isReady) {
            this.disabledButtons[name.toUpperCase()] = value;
        }
    };
    PHASER_CONTROLS.prototype.getKeyDisabledValue = function (name) {
        if (this.properties.isReady) {
            return this.disabledButtons[name.toUpperCase()];
        }
        else {
            return null;
        }
    };
    PHASER_CONTROLS.prototype.clearAllControlIntervals = function () {
        if (this.properties.isReady) {
            for (var _i = 0, _a = this.buttonArray; _i < _a.length; _i++) {
                var btn = _a[_i];
                clearInterval(this.IO.sensitivityPress[btn]);
            }
        }
    };
    PHASER_CONTROLS.prototype.getKeyId = function (key) {
        return this.buttonMapId[key.toUpperCase()];
    };
    PHASER_CONTROLS.prototype.read = function (key) {
        if (this.properties.isReady) {
            var _return = {};
            return _return[key] = { id: this.buttonMapId[key.toUpperCase()], active: this.IO.state[key.toUpperCase()]().val > 0 ? true : false, duration: this.IO.state[key.toUpperCase()]().val, state: this.IO.state[key.toUpperCase()]().state, type: this.IO.state[key.toUpperCase()]().type, disabled: this.disabledButtons[key.toUpperCase()] };
        }
        return {};
    };
    PHASER_CONTROLS.prototype.readMulti = function (keys, returnAs) {
        if (returnAs === void 0) { returnAs = 'OBJECT'; }
        if (this.properties.isReady) {
            if (returnAs === 'OBJECT') {
                var _return = {};
                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    var key = keys_1[_i];
                    _return[key] = { id: this.buttonMapId[key.toUpperCase()], active: this.IO.state[key.toUpperCase()]().val > 0 ? true : false, duration: this.IO.state[key.toUpperCase()]().val, state: this.IO.state[key.toUpperCase()]().state, type: this.IO.state[key.toUpperCase()]().type, disabled: this.disabledButtons[key.toUpperCase()] };
                }
                return _return;
            }
            if (returnAs === 'ARRAY') {
                var _return = [];
                for (var _a = 0, keys_2 = keys; _a < keys_2.length; _a++) {
                    var key = keys_2[_a];
                    _return.push({ id: this.buttonMapId[key.toUpperCase()], key: key, active: this.IO.state[key.toUpperCase()]().val > 0 ? true : false, duration: this.IO.state[key.toUpperCase()]().val, state: this.IO.state[key.toUpperCase()]().state, type: this.IO.state[key.toUpperCase()]().type, disabled: this.disabledButtons[key.toUpperCase()] });
                }
                return _return;
            }
        }
    };
    PHASER_CONTROLS.prototype.getReleasedKeys = function () {
        return this.releasedKeys;
    };
    PHASER_CONTROLS.prototype.getOnly = function (names) {
        var _this = this;
        var _return = {};
        var _loop_4 = function (key) {
            names.map(function (name) {
                if (key === name) {
                    _return[key] = { id: _this.buttonMapId[key.toUpperCase()], active: _this.IO.state[key.toUpperCase()]().val > 0 ? true : false, duration: _this.IO.state[key.toUpperCase()]().val, state: _this.IO.state[key.toUpperCase()]().state, type: _this.IO.state[key.toUpperCase()]().type, disabled: _this.disabledButtons[key.toUpperCase()] };
                }
            });
        };
        for (var _i = 0, _a = this.buttonArray; _i < _a.length; _i++) {
            var key = _a[_i];
            _loop_4(key);
        }
        return _return;
    };
    PHASER_CONTROLS.prototype.getAll = function () {
        var _return = {};
        for (var _i = 0, _a = this.buttonArray; _i < _a.length; _i++) {
            var key = _a[_i];
            _return[key] = { id: this.buttonMapId[key.toUpperCase()], active: this.IO.state[key.toUpperCase()]().val > 0 ? true : false, duration: this.IO.state[key.toUpperCase()]().val, state: this.IO.state[key.toUpperCase()]().state, type: this.IO.state[key.toUpperCase()]().type, disabled: this.disabledButtons[key.toUpperCase()] };
        }
        return _return;
    };
    PHASER_CONTROLS.prototype.debuggerString = function (key) {
        return key.toUpperCase() + " (" + this.buttonMap[key.toUpperCase()].name + "/" + this.buttonMap[key.toUpperCase()].code + ") | id: " + this.buttonMapId[key.toUpperCase()] + " duration: " + this.IO.state[key.toUpperCase()]().val + " | state: " + this.IO.state[key.toUpperCase()]().state + " | type: " + this.IO.state[key.toUpperCase()]().type + " | disabled: " + this.disabledButtons[key.toUpperCase()];
    };
    PHASER_CONTROLS.prototype.getBtnPressType = function (val) {
        var _this = this;
        var _type = 'NONE', _state = 0, state = 0;
        Object.keys(this.buttonSensitivity).forEach(function (key) {
            state++;
            if (val > _this.buttonSensitivity[key]) {
                _type = key;
                _state = state;
            }
        });
        return { val: val, type: _type, state: _state };
    };
    PHASER_CONTROLS.prototype.destroyAll = function () {
        var _this = this;
        this.clearAllControlIntervals();
        Object.keys(this.debugger.text).forEach(function (key) {
            _this.debugger.text[key].destroy();
        });
    };
    return PHASER_CONTROLS;
}());
var PHASER_GROUP_MANAGER = (function () {
    function PHASER_GROUP_MANAGER() {
        this.game = null;
        this.group = {
            array: [],
            object: {}
        };
    }
    PHASER_GROUP_MANAGER.prototype.assign = function (game, layers) {
        if (layers === void 0) { layers = 10; }
        this.game = game;
        for (var i = 0; i <= layers; i++) {
            var layer = game.add.group();
            this.group.object["" + i] = layer;
            this.group.array.push(layer);
        }
    };
    PHASER_GROUP_MANAGER.prototype.layer = function (key) {
        return this.group.object[key];
    };
    PHASER_GROUP_MANAGER.prototype.add = function (key, item) {
        this.group.object[key].add(item);
    };
    PHASER_GROUP_MANAGER.prototype.addMany = function (key, list) {
        var _this = this;
        list.forEach(function (item) {
            _this.group.object[key].add(item);
        });
    };
    return PHASER_GROUP_MANAGER;
}());
var PHASER_MASTER = (function () {
    function PHASER_MASTER(params) {
        var _this = this;
        this._game = params.game;
        this.element = params.element;
        this.resolution = params.resolution;
        this.states = {
            BOOT: 'BOOT',
            PRELOAD: 'PRELOAD',
            READY: 'READY',
        };
        this.currentState = this.states[0];
        this.variables = {};
        setTimeout(function () {
            _this._game.time.pausedTimeTotal = 0;
            _this._game.time.addToPausedTime = function (duration) {
                _this._game.time.pausedTimeTotal += duration;
            };
            _this._game.time.returnTrueTime = function () {
                return (_this._game.time.now - _this._game.time.pausedTimeTotal);
            };
        }, 1);
    }
    PHASER_MASTER.prototype.let = function (key, value) {
        if (value === void 0) { value = null; }
        if ((this.variables[key] === undefined)) {
            return this.variables[key] = value;
        }
        else {
            console.log("Cannot LET duplicate key in PHASER_MASTER: " + key);
        }
    };
    PHASER_MASTER.prototype.forceLet = function (key, value) {
        if (value === void 0) { value = null; }
        return this.variables[key] = value;
    };
    PHASER_MASTER.prototype.delete = function (key) {
        delete this.variables[key];
    };
    PHASER_MASTER.prototype.get = function (key) {
        if (this.variables[key] !== undefined) {
            return this.variables[key];
        }
        else {
            console.log("Cannot GET a variable that does not exist in PHASER_MASTER.");
            return null;
        }
    };
    PHASER_MASTER.prototype.getAll = function () {
        return this.variables;
    };
    PHASER_MASTER.prototype.getOnly = function (names) {
        var _return = {};
        var toArray = [];
        for (var key in this.variables) {
            toArray.push({ key: key, data: this.variables[key] });
        }
        var _loop_5 = function (i) {
            var _r = toArray.filter(function (obj) {
                return obj.key === names[i];
            });
            _r.map(function (obj) {
                _return[obj.key] = obj.data;
            });
        };
        for (var i = 0; i < names.length; i++) {
            _loop_5(i);
        }
        return _return;
    };
    PHASER_MASTER.prototype.changeState = function (state) {
        if (state === void 0) { state = null; }
        var _state = state.toUpperCase();
        var create = false;
        if (this.states[_state] === undefined) {
            this.states[_state] = _state;
            create = true;
        }
        this.currentState = _state;
        return { created: create, state: this.currentState };
    };
    PHASER_MASTER.prototype.getCurrentState = function () {
        return this.currentState;
    };
    PHASER_MASTER.prototype.getElement = function () {
        return this.element;
    };
    PHASER_MASTER.prototype.getStates = function () {
        return this.states;
    };
    PHASER_MASTER.prototype.getResolution = function () {
        return this.resolution;
    };
    PHASER_MASTER.prototype.checkState = function (state) {
        return this.currentState === state.toUpperCase() ? true : false;
    };
    PHASER_MASTER.prototype.getState = function () {
        var _return = { currentState: this.currentState };
        return _return;
    };
    PHASER_MASTER.prototype.game = function () {
        return this._game;
    };
    return PHASER_MASTER;
}());
var PHASER_MOUSE = (function () {
    function PHASER_MOUSE(params) {
        this.game = null;
        this.clickSensitvity = { QUICK: 1, SHORT: 50, LONG: 150, SUPERLONG: 300 };
        this.mouseMapping = [0, 1, 2];
        this.mouseMap = {
            LEFT: 0,
            MIDDLE: 1,
            RIGHT: 2
        };
        this.metrics = {
            sensitivityPress: {},
            sensitivityBuffer: {},
            location: {},
            state: {}
        };
        this.properties = {
            allowDebugger: true,
            timingRefreshRate: 1
        };
        this.inputDelay = {
            delay: Array.apply(null, Array(2)).map(function () { return 0; })
        };
        this.debugger = {
            enabled: params.showDebugger === undefined ? false : params.showDebugger,
            text: {},
            pointer: null
        };
    }
    PHASER_MOUSE.prototype.assign = function (game) {
        var _this = this;
        this.game = game;
        var _loop_6 = function (key) {
            this_3.metrics.sensitivityPress[key] = null;
            this_3.metrics.sensitivityBuffer[key] = 0;
            this_3.metrics.location[key] = { x: null, y: null };
            this_3.metrics.state[key] = function () {
                return _this.getBtnPressType(_this.metrics.sensitivityBuffer[key]);
            };
        };
        var this_3 = this;
        for (var _i = 0, _a = this.mouseMapping; _i < _a.length; _i++) {
            var key = _a[_i];
            _loop_6(key);
        }
        this.game.input.onDown.add(function (e) {
            var mouseKey = _this.checkMouseClick();
            clearInterval(_this.metrics.sensitivityPress[mouseKey]);
            _this.metrics.sensitivityPress[mouseKey] = setInterval(function () {
                _this.metrics.sensitivityBuffer[mouseKey] += 1;
                _this.metrics.location[mouseKey] = { x: e.x, y: e.y };
            }, _this.properties.timingRefreshRate);
        });
        this.game.input.onUp.add(function (e) {
            var mouseKey = _this.checkMouseClick();
            _this.clearAllControlIntervals();
            _this.metrics.sensitivityBuffer[mouseKey] = 0;
        });
        var style = { font: "12px Courier New", fill: "#fff", align: "left" };
        this.mouseMapping.forEach(function (btn, index) {
            _this.debugger.text[btn] = null;
            _this.debugger.text[btn] = _this.game.add.text(5, _this.game.height - 35 - (index * 15), "", style);
        });
        this.debugger.pointer = this.game.add.text(5, this.game.height - 20, "", style);
        game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
    };
    PHASER_MOUSE.prototype.checkMouseClick = function () {
        var mouseKey = 0;
        if (this.game.input.activePointer.leftButton.isDown) {
            mouseKey = 0;
        }
        if (this.game.input.activePointer.middleButton.isDown) {
            mouseKey = 1;
        }
        if (this.game.input.activePointer.rightButton.isDown) {
            mouseKey = 2;
        }
        return mouseKey;
    };
    PHASER_MOUSE.prototype.debuggerString = function (mouseKey) {
        return "Button_" + mouseKey + " | {x: " + this.metrics.location[mouseKey].x + ", y: " + this.metrics.location[mouseKey].y + "} | active: " + (this.metrics.sensitivityBuffer[mouseKey] > 0 ? true : false) + " | state: " + this.metrics.state[mouseKey]().state + " | duration: " + this.metrics.state[mouseKey]().val + " | type: " + this.metrics.state[mouseKey]().type;
    };
    PHASER_MOUSE.prototype.setDebugger = function (state) {
        if (state === void 0) { state = true; }
        this.debugger.enabled = state;
    };
    PHASER_MOUSE.prototype.updateDebugger = function () {
        for (var _i = 0, _a = this.mouseMapping; _i < _a.length; _i++) {
            var btn = _a[_i];
            this.debugger.text[btn].setText(this.debugger.enabled ? this.debuggerString(btn) : '').bringToTop();
        }
        this.debugger.pointer.setText(this.debugger.enabled ? "Pointer: {x: " + this.game.input.mousePointer.x + ", y: " + this.game.input.mousePointer.y + "}" : '').bringToTop();
    };
    PHASER_MOUSE.prototype.clearAllControlIntervals = function () {
        for (var _i = 0, _a = this.mouseMapping; _i < _a.length; _i++) {
            var key = _a[_i];
            this.metrics.sensitivityBuffer[key] = 0;
            clearInterval(this.metrics.sensitivityPress[key]);
        }
    };
    PHASER_MOUSE.prototype.checkWithDelay = function (params) {
        if (this.read(params.key).active === params.isActive) {
            var mouseKey = this.mouseMap[params.key.toUpperCase()];
            if (this.game.time.now > this.inputDelay.delay[mouseKey]) {
                this.inputDelay.delay[mouseKey] = params.delay + this.game.time.now;
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    };
    PHASER_MOUSE.prototype.read = function (key) {
        if (key === void 0) { key = 'LEFT'; }
        var mouseKey = this.mouseMap[key.toUpperCase()];
        return {
            id: mouseKey,
            x: this.metrics.location[mouseKey].x,
            y: this.metrics.location[mouseKey].y,
            active: this.metrics.sensitivityBuffer[mouseKey] > 0 ? true : false,
            duration: this.metrics.sensitivityBuffer[mouseKey],
            state: this.metrics.state[mouseKey]().state,
            type: this.metrics.state[mouseKey]().type
        };
    };
    PHASER_MOUSE.prototype.getBtnPressType = function (val) {
        var _this = this;
        var _type = 'NONE', _state = 0, state = 0;
        Object.keys(this.clickSensitvity).forEach(function (key) {
            state++;
            if (val > _this.clickSensitvity[key]) {
                _type = key;
                _state = state;
            }
        });
        return { val: val, type: _type, state: _state };
    };
    return PHASER_MOUSE;
}());
var PHASER_PRELOADER = (function () {
    function PHASER_PRELOADER(params) {
        this.game = params.game;
        this.init(params.delayInSeconds, params.done);
    }
    PHASER_PRELOADER.prototype.init = function (delay, done) {
        var _this = this;
        var loadingtext, loadingPercentage;
        this.game.load.onLoadStart.add(function () {
            loadingtext = _this.game.add.text(_this.game.world.centerX, _this.game.world.centerY / 2, "", { font: "18px Impact", fill: "#fff", align: "center" });
            loadingtext.anchor.set(0.5);
            loadingPercentage = _this.game.add.text(_this.game.world.centerX, _this.game.world.centerY, "", { font: "32px Impact", fill: "#fff", align: "center" });
            loadingPercentage.anchor.set(0.5);
        }, this);
        this.game.load.onFileComplete.add(function (progress, cacheKey, success, totalLoaded, totalFiles) {
            loadingtext.setText("Please wait...");
            loadingPercentage.setText(progress + "%");
        }, this);
        this.game.load.onLoadComplete.add(function () {
            loadingtext.setText("File loaded!");
            loadingPercentage.setText("");
            _this.game.time.events.add(Phaser.Timer.SECOND * delay, function () {
                loadingtext.destroy();
                loadingPercentage.destroy();
                done();
            }, _this).autoDestroy = true;
        }, this);
    };
    return PHASER_PRELOADER;
}());
var PHASER_SPRITE_MANAGER = (function () {
    function PHASER_SPRITE_MANAGER() {
        this.game = null;
        this.sprites = {
            array: [],
            object: {}
        };
        this.spriteCount = 0;
    }
    PHASER_SPRITE_MANAGER.prototype.assign = function (game) {
        this.game = game;
    };
    PHASER_SPRITE_MANAGER.prototype.add = function (params) {
        var duplicateCheck = this.sprites.array.filter(function (obj) {
            return obj.name === params.name;
        });
        if (duplicateCheck.length === 0) {
            params.x = params.x !== undefined ? params.x : 0;
            params.y = params.y !== undefined ? params.y : 0;
            params.group = params.group !== undefined ? params.group : null;
            params.org = params.org !== undefined ? params.org : null;
            params.visible = params.visible !== undefined ? params.visible : true;
            params.alpha = params.alpha !== undefined ? params.alpha : 1;
            params.width = params.width !== undefined ? params.width : null;
            params.height = params.height !== undefined ? params.height : null;
            var newSprite = this.game.add.sprite(params.x, params.y, params.reference);
            newSprite.name = params.name;
            newSprite.group = params.group;
            newSprite.org = params.org;
            newSprite.defaultPosition = { x: params.x, y: params.y };
            newSprite.visible = params.visible;
            newSprite.alpha = params.alpha;
            if (params.width !== null) {
                newSprite.width = params.width;
            }
            if (params.height !== null) {
                newSprite.height = params.height;
            }
            newSprite.setDefaultPositions = function (x, y) { this.defaultPosition.x = x ? x : this.x, this.defaultPosition.y = y ? y : this.y; };
            newSprite.getDefaultPositions = function () { return this.defaultPosition; };
            newSprite.init = function () { };
            newSprite.onUpdate = function () { };
            newSprite.reveal = function () { };
            newSprite.show = function () {
                this.visible = true;
            };
            newSprite.hide = function () {
                this.visible = false;
            };
            this.sprites.array.push(newSprite);
            this.sprites.object[params.name] = newSprite;
            return newSprite;
        }
        else {
            console.log("Duplicate key name not allowed: " + params.name);
        }
    };
    PHASER_SPRITE_MANAGER.prototype.addFromAtlas = function (params) {
        var duplicateCheck = this.sprites.array.filter(function (obj) {
            return obj.name === params.name;
        });
        if (duplicateCheck.length === 0) {
            params.x = params.x !== undefined ? params.x : 0;
            params.y = params.y !== undefined ? params.y : 0;
            params.group = params.group !== undefined ? params.group : null;
            params.org = params.org !== undefined ? params.org : null;
            params.visible = params.visible !== undefined ? params.visible : true;
            params.alpha = params.alpha !== undefined ? params.alpha : 1;
            params.width = params.width !== undefined ? params.width : null;
            params.height = params.height !== undefined ? params.height : null;
            var newSprite = this.game.add.sprite(params.x, params.y, params.atlas, params.filename);
            newSprite.name = params.name;
            newSprite.group = params.group;
            newSprite.org = params.org;
            newSprite.defaultPosition = { x: params.x, y: params.y };
            newSprite.visible = params.visible;
            newSprite.alpha = params.alpha;
            if (params.width !== null) {
                newSprite.width = params.width;
            }
            if (params.height !== null) {
                newSprite.height = params.height;
            }
            newSprite.setDefaultPositions = function (x, y) { this.defaultPosition.x = x ? x : this.x, this.defaultPosition.y = y ? y : this.y; };
            newSprite.getDefaultPositions = function () { return this.defaultPosition; };
            newSprite.init = function () { };
            newSprite.onUpdate = function () { };
            newSprite.reveal = function () { };
            newSprite.show = function () {
                this.visible = true;
            };
            newSprite.hide = function () {
                this.visible = false;
            };
            this.sprites.array.push(newSprite);
            this.sprites.object[params.name] = newSprite;
            return newSprite;
        }
        else {
            console.log("Duplicate key name not allowed: " + params.name);
        }
    };
    PHASER_SPRITE_MANAGER.prototype.addTilespriteFromAtlas = function (params) {
        var duplicateCheck = this.sprites.array.filter(function (obj) {
            return obj.name === params.name;
        });
        if (duplicateCheck.length === 0) {
            params.x = params.x !== undefined ? params.x : 0;
            params.y = params.y !== undefined ? params.y : 0;
            params.group = params.group !== undefined ? params.group : null;
            params.org = params.org !== undefined ? params.org : null;
            params.visible = params.visible !== undefined ? params.visible : true;
            params.alpha = params.alpha !== undefined ? params.alpha : 1;
            params.width = params.width !== undefined ? params.width : null;
            params.height = params.height !== undefined ? params.height : null;
            var newSprite = this.game.add.tileSprite(params.x, params.y, params.width, params.height, params.atlas, params.filename);
            newSprite.name = params.name;
            newSprite.group = params.group;
            newSprite.org = params.org;
            newSprite.defaultPosition = { x: params.x, y: params.y };
            newSprite.visible = params.visible;
            newSprite.alpha = params.alpha;
            if (params.width !== null) {
                newSprite.width = params.width;
            }
            if (params.height !== null) {
                newSprite.height = params.height;
            }
            newSprite.setDefaultPositions = function (x, y) { this.defaultPosition.x = x ? x : this.x, this.defaultPosition.y = y ? y : this.y; };
            newSprite.getDefaultPositions = function () { return this.defaultPosition; };
            newSprite.init = function () { };
            newSprite.onUpdate = function () { };
            newSprite.reveal = function () { };
            newSprite.show = function () {
                this.visible = true;
            };
            newSprite.hide = function () {
                this.visible = false;
            };
            this.sprites.array.push(newSprite);
            this.sprites.object[params.name] = newSprite;
            return newSprite;
        }
        else {
            console.log("Duplicate key name not allowed: " + params.name);
        }
    };
    PHASER_SPRITE_MANAGER.prototype.addEmptySprite = function (params) {
        var duplicateCheck = this.sprites.array.filter(function (obj) {
            return obj.name === params.name;
        });
        if (duplicateCheck.length === 0) {
            params.x = params.x !== undefined ? params.x : 0;
            params.y = params.y !== undefined ? params.y : 0;
            params.group = params.group !== undefined ? params.group : null;
            params.org = params.org !== undefined ? params.org : null;
            params.visible = params.visible !== undefined ? params.visible : true;
            params.alpha = params.alpha !== undefined ? params.alpha : 1;
            params.width = params.width !== undefined ? params.width : null;
            params.height = params.height !== undefined ? params.height : null;
            var newSprite = this.game.add.sprite(params.x, params.y);
            newSprite.name = params.name;
            newSprite.group = params.group;
            newSprite.org = params.org;
            newSprite.defaultPosition = { x: params.x, y: params.y };
            newSprite.visible = params.visible;
            newSprite.alpha = params.alpha;
            if (params.width !== null) {
                newSprite.width = params.width;
            }
            if (params.height !== null) {
                newSprite.height = params.height;
            }
            newSprite.setDefaultPositions = function (x, y) { this.defaultPosition.x = x ? x : this.x, this.defaultPosition.y = y ? y : this.y; };
            newSprite.getDefaultPositions = function () { return this.defaultPosition; };
            newSprite.init = function () { };
            newSprite.onUpdate = function () { };
            newSprite.reveal = function () { };
            newSprite.show = function () {
                this.visible = true;
            };
            newSprite.hide = function () {
                this.visible = false;
            };
            this.sprites.array.push(newSprite);
            this.sprites.object[params.name] = newSprite;
            return newSprite;
        }
        else {
            console.log("Duplicate key name not allowed: " + params.name);
        }
    };
    PHASER_SPRITE_MANAGER.prototype.createBasicMask = function (x, y, width, height) {
        var mask = this.game.add.graphics(0, 0);
        mask.beginFill(0xffffff);
        mask.drawRect(x, y, width, height);
        return mask;
    };
    PHASER_SPRITE_MANAGER.prototype.addBasicMaskToSprite = function (sprite) {
        var mask = this.game.add.graphics(0, 0);
        mask.beginFill(0xffffff);
        mask.drawRect(sprite.x, sprite.y, sprite.width, sprite.height);
        sprite.mask = mask;
        return mask;
    };
    PHASER_SPRITE_MANAGER.prototype.destroy = function (name) {
        if (this.sprites.object[name] !== undefined) {
            var destroyed = [];
            var deleteArray = this.sprites.array.filter(function (obj) {
                return obj.name === name;
            });
            for (var _i = 0, deleteArray_1 = deleteArray; _i < deleteArray_1.length; _i++) {
                var obj = deleteArray_1[_i];
                destroyed.push(obj.name);
                obj.destroy();
            }
            delete this.sprites.object[name];
            this.sprites.array = this.sprites.array.filter(function (obj) {
                return obj.name !== name;
            });
            return destroyed;
        }
        else {
            console.log("Cannot delete " + name + " because it does not exist.");
            return null;
        }
    };
    PHASER_SPRITE_MANAGER.prototype.destroyGroup = function (name) {
        var destroyed = [];
        var deleteArray = this.sprites.array.filter(function (obj) {
            return obj.group === name;
        });
        for (var _i = 0, deleteArray_2 = deleteArray; _i < deleteArray_2.length; _i++) {
            var sprite = deleteArray_2[_i];
            destroyed.push(sprite.name);
            sprite.destroy();
        }
        delete this.sprites.object[name];
        this.sprites.array = this.sprites.array.filter(function (obj) {
            return obj.group !== name;
        });
        return destroyed;
    };
    PHASER_SPRITE_MANAGER.prototype.get = function (name) {
        return this.sprites.object[name];
    };
    PHASER_SPRITE_MANAGER.prototype.getGroup = function (name) {
        return this.sprites.array.filter(function (obj) {
            return obj.group === name || obj.org === name;
        });
    };
    PHASER_SPRITE_MANAGER.prototype.getManyGroups = function (names) {
        var _return = [];
        var _loop_7 = function (i) {
            var _r = this_4.sprites.array.filter(function (obj) {
                return obj.group === names[i] || obj.org === names[i];
            });
            _return = _return.concat(_r);
        };
        var this_4 = this;
        for (var i = 0; i < names.length; i++) {
            _loop_7(i);
        }
        return _return;
    };
    PHASER_SPRITE_MANAGER.prototype.getOnly = function (names) {
        var _return = {};
        var _loop_8 = function (i) {
            var _r = this_5.sprites.array.filter(function (obj) {
                return obj.group === names[i] || obj.name === names[i];
            });
            _r.map(function (obj) {
                _return[obj.name] = obj;
            });
        };
        var this_5 = this;
        for (var i = 0; i < names.length; i++) {
            _loop_8(i);
        }
        return _return;
    };
    PHASER_SPRITE_MANAGER.prototype.getAll = function (type) {
        if (type === void 0) { type = 'OBJECT'; }
        if (type === 'ARRAY') {
            return this.sprites.array;
        }
        if (type == 'OBJECT') {
            return this.sprites.object;
        }
        return { object: this.sprites.object, array: this.sprites.array };
    };
    PHASER_SPRITE_MANAGER.prototype.count = function () {
        this.spriteCount++;
        return { total: this.sprites.array.length, unique: this.spriteCount };
    };
    PHASER_SPRITE_MANAGER.prototype.centerWorld = function (name) {
        if (this.sprites.object[name] === undefined) {
            console.log('Error centering sprite:  key does not exists.');
            return null;
        }
        var obj = this.sprites.object[name];
        obj.alignIn(this.game.world.bounds, Phaser.CENTER);
        return obj;
    };
    PHASER_SPRITE_MANAGER.prototype.centerOnPoint = function (name, x, y) {
        if (this.sprites.object[name] === undefined) {
            console.log('Error centering sprite:  key does not exists.');
            return null;
        }
        var obj = this.sprites.object[name];
        obj.x = x - (obj.width / 2);
        obj.y = y - (obj.height / 2);
        return obj;
    };
    return PHASER_SPRITE_MANAGER;
}());
var PHASER_TEXT_MANAGER = (function () {
    function PHASER_TEXT_MANAGER() {
        this.game = null;
        this.texts = {
            array: [],
            object: {}
        };
    }
    PHASER_TEXT_MANAGER.prototype.assign = function (game) {
        this.game = game;
    };
    PHASER_TEXT_MANAGER.prototype.add = function (params) {
        var duplicateCheck = this.texts.array.filter(function (obj) {
            return obj.name === params.name;
        });
        params.x = params.x !== undefined ? params.x : 0;
        params.y = params.y !== undefined ? params.y : 0;
        params.group = params.group !== undefined ? params.group : null;
        params.size = params.size !== undefined ? params.size : 12;
        params.default = params.default !== undefined ? params.default : '';
        params.visible = params.visible !== undefined ? params.visible : true;
        params.alpha = params.alpha !== undefined ? params.alpha : 1;
        if (duplicateCheck.length === 0) {
            var newText = this.game.add.bitmapText(params.x, params.y, params.font, params.default, params.size);
            newText.name = params.name;
            newText.group = params.group;
            newText.visible = params.visible;
            newText.alpha = params.alpha;
            newText.init = function () { };
            newText.show = function () {
                this.visible = true;
            };
            newText.hide = function () {
                this.visible = false;
            };
            this.texts.array.push(newText);
            this.texts.object[params.name] = newText;
            return newText;
        }
        else {
            console.log("Duplicate key name not allowed: " + params.name);
        }
    };
    PHASER_TEXT_MANAGER.prototype.destroy = function (name) {
        var destroyArray = [];
        var deleteArray = this.texts.array.filter(function (obj) {
            return obj.name === name;
        });
        for (var _i = 0, deleteArray_3 = deleteArray; _i < deleteArray_3.length; _i++) {
            var text = deleteArray_3[_i];
            destroyArray.push(text.name);
            text.destroy();
        }
        delete this.texts.object[name];
        this.texts.array = this.texts.array.filter(function (obj) {
            return obj.name !== name;
        });
        return destroyArray;
    };
    PHASER_TEXT_MANAGER.prototype.destroyGroup = function (name) {
        var destroyArray = [];
        var deletearray = this.texts.array.filter(function (obj) {
            return obj.group === name;
        });
        for (var _i = 0, deletearray_1 = deletearray; _i < deletearray_1.length; _i++) {
            var text = deletearray_1[_i];
            destroyArray.push(text.key);
            text.destroy();
        }
        delete this.texts.object[name];
        this.texts.array = this.texts.array.filter(function (obj) {
            return obj.group !== name;
        });
        return destroyArray;
    };
    PHASER_TEXT_MANAGER.prototype.get = function (key) {
        return this.texts.object[key];
    };
    PHASER_TEXT_MANAGER.prototype.getGroup = function (key) {
        return this.texts.array.filter(function (obj) {
            return obj.group === key;
        });
    };
    PHASER_TEXT_MANAGER.prototype.getManyGroups = function (names) {
        var _return = [];
        var _loop_9 = function (i) {
            var _r = this_6.texts.array.filter(function (obj) {
                return obj.group === names[i];
            });
            _return = _return.concat(_r);
        };
        var this_6 = this;
        for (var i = 0; i < names.length; i++) {
            _loop_9(i);
        }
        return _return;
    };
    PHASER_TEXT_MANAGER.prototype.getAll = function (type) {
        if (type === void 0) { type = 'OBJECT'; }
        if (type === 'ARRAY') {
            return this.texts.array;
        }
        if (type == 'OBJECT') {
            return this.texts.object;
        }
        return { object: this.texts.object, array: this.texts.array };
    };
    PHASER_TEXT_MANAGER.prototype.getOnly = function (names) {
        var _return = {};
        var _loop_10 = function (i) {
            var _r = this_7.texts.array.filter(function (obj) {
                return obj.group === names[i] || obj.name === names[i];
            });
            _r.map(function (obj) {
                _return[obj.name] = obj;
            });
        };
        var this_7 = this;
        for (var i = 0; i < names.length; i++) {
            _loop_10(i);
        }
        return _return;
    };
    PHASER_TEXT_MANAGER.prototype.alignToBottomLeftCorner = function (name, padding) {
        if (padding === void 0) { padding = 0; }
        if (this.texts.object[name] === undefined) {
            console.log('Error centering sprite:  key does not exists.');
            return null;
        }
        var text = this.texts.object[name], game = this.game;
        text.x = padding;
        text.y = game.canvas.height - text.height - padding;
        return text;
    };
    PHASER_TEXT_MANAGER.prototype.alignToBottomCenter = function (name, padding) {
        if (padding === void 0) { padding = 0; }
        if (this.texts.object[name] === undefined) {
            console.log('Error centering sprite:  key does not exists.');
            return null;
        }
        var text = this.texts.object[name], game = this.game;
        text.x = (game.canvas.width / 2) - (text.width / 2);
        text.y = game.canvas.height - text.height - padding;
        return text;
    };
    PHASER_TEXT_MANAGER.prototype.alignToBottomRightCorner = function (name, padding) {
        if (padding === void 0) { padding = 0; }
        if (this.texts.object[name] === undefined) {
            console.log('Error centering sprite:  key does not exists.');
            return null;
        }
        var text = this.texts.object[name], game = this.game;
        text.x = game.canvas.width - text.width - padding;
        text.y = game.canvas.height - text.height - padding;
        return text;
    };
    PHASER_TEXT_MANAGER.prototype.alignToCenterRight = function (name, padding) {
        if (padding === void 0) { padding = 0; }
        if (this.texts.object[name] === undefined) {
            console.log('Error centering sprite:  key does not exists.');
            return null;
        }
        var text = this.texts.object[name], game = this.game;
        text.x = game.canvas.width - text.width - padding;
        text.y = (game.canvas.height / 2) - (text.height / 2);
        return text;
    };
    PHASER_TEXT_MANAGER.prototype.alignToTopRightCorner = function (name, padding) {
        if (padding === void 0) { padding = 0; }
        if (this.texts.object[name] === undefined) {
            console.log('Error centering sprite:  key does not exists.');
            return null;
        }
        var text = this.texts.object[name], game = this.game;
        text.x = game.canvas.width - text.width - padding;
        text.y = padding;
        return text;
    };
    PHASER_TEXT_MANAGER.prototype.alignToTopCenter = function (name, padding) {
        if (padding === void 0) { padding = 0; }
        if (this.texts.object[name] === undefined) {
            console.log('Error centering sprite:  key does not exists.');
            return null;
        }
        var text = this.texts.object[name], game = this.game;
        text.x = (game.canvas.width / 2) - (text.width / 2) - padding;
        text.y = padding;
        return text;
    };
    PHASER_TEXT_MANAGER.prototype.alignToTopLeftCorner = function (name, padding) {
        if (padding === void 0) { padding = 0; }
        if (this.texts.object[name] === undefined) {
            console.log('Error centering sprite:  key does not exists.');
            return null;
        }
        var text = this.texts.object[name], game = this.game;
        text.x = padding;
        text.y = padding;
        return text;
    };
    PHASER_TEXT_MANAGER.prototype.alignToCenterLeft = function (name, padding) {
        if (padding === void 0) { padding = 0; }
        if (this.texts.object[name] === undefined) {
            console.log('Error centering sprite:  key does not exists.');
            return null;
        }
        var text = this.texts.object[name], game = this.game;
        text.x = padding;
        text.y = (game.canvas.height / 2) - (text.height / 2);
        return text;
    };
    PHASER_TEXT_MANAGER.prototype.alignToCenter = function (name, padding) {
        if (padding === void 0) { padding = 0; }
        if (this.texts.object[name] === undefined) {
            console.log('Error centering sprite:  key does not exists.');
            return null;
        }
        var text = this.texts.object[name], game = this.game;
        text.x = (game.canvas.width / 2) - (text.width / 2);
        text.y = (game.canvas.height / 2) - (text.height / 2);
        return text;
    };
    PHASER_TEXT_MANAGER.prototype.center = function (name, offsetx, offsety) {
        if (offsetx === void 0) { offsetx = 0; }
        if (offsety === void 0) { offsety = 0; }
        if (this.texts.object[name] === undefined) {
            console.log('Error centering sprite:  key does not exists.');
            return null;
        }
        var text = this.texts.object[name], game = this.game;
        text.x = (game.canvas.width / 2) - (text.width / 2) + offsetx;
        text.y = (game.canvas.height / 2) - (text.height / 2) + offsety;
        return text;
    };
    return PHASER_TEXT_MANAGER;
}());
var DIALOG_MANAGER = (function () {
    function DIALOG_MANAGER() {
    }
    DIALOG_MANAGER.prototype.assign = function (game, phaserMaster, phaserSprites, phaserGroup, phaserTexts, phaserControls, atlas) {
        this.game = game;
        this.phaserSprites = phaserSprites;
        this.phaserMaster = phaserMaster;
        this.phaserGroup = phaserGroup;
        this.phaserTexts = phaserTexts;
        this.phaserControls = phaserControls;
        this.atlas = atlas;
        this.dialogGenerator;
        this.dialogbox;
    };
    DIALOG_MANAGER.prototype.create = function () {
        var _a = this, game = _a.game, phaserMaster = _a.phaserMaster, phaserSprites = _a.phaserSprites, phaserGroup = _a.phaserGroup, phaserTexts = _a.phaserTexts, atlas = _a.atlas;
        var _b = phaserMaster.getResolution(), w = _b.w, h = _b.h;
        var dialogbox = phaserSprites.addEmptySprite({ x: 0, y: h + 300, name: 'dialogbox', visible: false });
        dialogbox.reveal = function (callback) {
            var y = dialogbox.getDefaultPositions().y;
            dialogbox.visible = true;
            dialogbox.setDefaultPositions();
            dialogbox.children.map(function (child) {
                if (child.onStart !== undefined) {
                    child.onStart();
                }
            });
            game.add.tween(dialogbox).to({ y: h - 110 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Circular.InOut, true, 1, 0, false).
                onComplete.add(function () {
                callback();
            });
        };
        dialogbox.hide = function () {
            dialogbox.text.replaceText('');
            game.add.tween(dialogbox).to({ y: dialogbox.getDefaultPositions().y }, Phaser.Timer.SECOND / 2, Phaser.Easing.Circular.InOut, true, 1, 0, false).
                onComplete.add(function () {
                dialogbox.children.map(function (child) {
                    if (child.onStop !== undefined) {
                        child.onStop();
                    }
                });
            });
        };
        var dialogboxGraphic = phaserSprites.addFromAtlas({ x: 0, y: 0, width: w, height: 110, name: "dialogboxGraphic", filename: 'dialogbox', atlas: 'atlas_main', alpha: 0.8 });
        dialogbox.addChild(dialogboxGraphic);
        var dialogPortraitFrame = phaserSprites.addFromAtlas({ x: 10, y: 8, name: "dialogPortraitFrame", filename: 'ui_portraitContainer', atlas: 'atlas_main', visible: true });
        dialogbox.addChild(dialogPortraitFrame);
        var dialogPortraitMask = phaserSprites.createBasicMask(13, 11, dialogPortraitFrame.width - 3, dialogPortraitFrame.height - 3);
        dialogbox.addChild(dialogPortraitMask);
        dialogPortraitFrame.replaceImage = function (image) {
            if (phaserSprites.get('dialogPortraitImage') !== undefined) {
                phaserSprites.destroy('dialogPortraitImage');
            }
            var dialogPortraitImage = phaserSprites.addFromAtlas({ name: "dialogPortraitImage", filename: image, atlas: 'atlas_main' });
            dialogPortraitImage.mask = dialogPortraitMask;
            dialogPortraitFrame.addChild(dialogPortraitImage);
        };
        dialogPortraitFrame.onStart = function () {
            var staticAnimation = Phaser.Animation.generateFrameNames('portrait_static_', 1, 4).concat(Phaser.Animation.generateFrameNames('portrait_static_', 3, 1));
            var dialogboxStatic = phaserSprites.addFromAtlas({ x: 10, y: 8, name: "dialogboxStatic", filename: staticAnimation[0], atlas: 'atlas_main', visible: true, alpha: 0.35 });
            dialogboxStatic.animations.add('static', staticAnimation, 1, true);
            dialogboxStatic.mask = dialogPortraitMask;
            dialogbox.addChild(dialogboxStatic);
            dialogboxStatic.animations.play('static', 30, true);
        };
        dialogPortraitFrame.onStop = function () {
            phaserSprites.destroy('dialogboxStatic');
            if (phaserSprites.get('dialogPortraitImage') !== undefined) {
                phaserSprites.destroy('dialogPortraitImage');
            }
        };
        var animation = Phaser.Animation.generateFrameNames('a_button_', 1, 9).slice();
        var dialogboxButton = phaserSprites.addFromAtlas({ x: dialogboxGraphic.width - 40, y: dialogboxGraphic.height - 40, name: "dialogboxButton", filename: animation[0], atlas: 'atlas_main', visible: false });
        dialogboxButton.animations.add('animate', animation);
        dialogboxButton.onStop = function () {
            dialogboxButton.animations.stop(null, true);
        };
        dialogbox.addChild(dialogboxButton);
        var dialogText = phaserTexts.add({ x: 100, y: 10, name: "dialogtext", font: 'gem', size: 16 });
        dialogText.maxWidth = w - 100 - 15;
        dialogbox.addChild(dialogText);
        dialogText.replaceText = function (newText, callback) {
            if (callback === void 0) { callback = function () { }; }
            dialogText.alpha = 0;
            dialogboxButton.visible = false;
            dialogText.setText(newText);
            game.add.tween(dialogText).to({ alpha: 1 }, Phaser.Timer.SECOND / 2, Phaser.Easing.Linear.In, true, 1, 0, false).
                onComplete.add(function () {
                dialogboxButton.visible = true;
                callback();
            });
        };
        dialogText.onStart = function () { };
        dialogText.onStop = function () {
            dialogText.replaceText('');
        };
        var skipallText = phaserTexts.add({ y: -20, name: "skipallText", font: 'gem', default: 'PRESS START TO SKIP', size: 15, visible: false });
        skipallText.x = w - skipallText.width - 10;
        dialogbox.addChild(skipallText);
        dialogbox.portrait = dialogPortraitFrame;
        dialogbox.text = dialogText;
        dialogbox.skipallText = skipallText;
        dialogbox.dialogboxButton = dialogboxButton;
        this.dialogbox = dialogbox;
        phaserGroup.addMany(phaserMaster.get('layers').DIALOGBOX, [dialogbox]);
    };
    DIALOG_MANAGER.prototype.dialog = function (data) {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < data.length)) return [3, 4];
                    return [4, data[i]];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3, 1];
                case 4: return [4, null];
                case 5:
                    _a.sent();
                    return [2];
            }
        });
    };
    DIALOG_MANAGER.prototype.start = function (script, callback) {
        var _a = this, game = _a.game, phaserMaster = _a.phaserMaster, phaserSprites = _a.phaserSprites, phaserGroup = _a.phaserGroup, phaserTexts = _a.phaserTexts, phaserControls = _a.phaserControls, atlas = _a.atlas;
        var currentState = phaserMaster.getState().currentState;
        var gen = this.dialog(script);
        this.canSkip = false;
        this.onTimer = false;
        this.autoplay = false;
        gen.complete = callback;
        gen.revertToState = currentState;
        gen.isReady = false;
        phaserControls.enableAllActionButtons();
        this.createDialogbox(gen);
        gen.nextItem = function (data) {
            var txtMsg = data.text;
            var portrait = data.portrait;
            gen.dialogbox.portrait.replaceImage(portrait);
            gen.dialogbox.text.replaceText(txtMsg, function () { });
        };
        gen.finished = function () {
            phaserSprites.getGroup('player_healthbar').concat(phaserSprites.getGroup('player_pow')).map(function (obj) {
                obj.fadeIn();
            });
            phaserMaster.changeState(gen.revertToState);
            gen.dialogbox.hide();
            callback();
        };
        phaserMaster.changeState('DIALOG');
        this.dialogGenerator = gen;
    };
    DIALOG_MANAGER.prototype.createDialogbox = function (gen) {
        var _this = this;
        var _a = this, game = _a.game, phaserMaster = _a.phaserMaster, phaserSprites = _a.phaserSprites, phaserGroup = _a.phaserGroup, phaserTexts = _a.phaserTexts, phaserControls = _a.phaserControls, atlas = _a.atlas;
        var dialogbox = this.dialogbox;
        phaserSprites.getGroup('player_healthbar').concat(phaserSprites.getGroup('player_pow')).map(function (obj) {
            obj.fadeOut();
        });
        dialogbox.reveal(function () {
            gen.dialogbox = dialogbox;
            gen.dialogbox.text.replaceText('', function () {
                gen.isReady = true;
                _this.next();
            });
        });
    };
    DIALOG_MANAGER.prototype.next = function (force) {
        var _this = this;
        if (force === void 0) { force = false; }
        var dialogbox = this.dialogbox;
        if ((this.dialogGenerator.isReady && !this.onTimer) || force) {
            var line_1 = this.dialogGenerator.next().value;
            if (line_1 === null) {
                this.dialogGenerator.finished();
            }
            else {
                if (!!line_1.autoplay) {
                    this.autoplay = line_1.autoplay;
                    if (this.autoplay) {
                        dialogbox.dialogboxButton.animations.play('animate', 6, true);
                    }
                    else {
                        dialogbox.dialogboxButton.animations.stop('animate');
                    }
                }
                if (this.autoplay) {
                    line_1.timer = (line_1.text.length * 50 > 2500) ? (line_1.text.length * 50) : 2500;
                }
                if (!!line_1.canSkip) {
                    this.canSkip = line_1.canSkip;
                }
                dialogbox.skipallText.visible = this.canSkip;
                if (!!line_1.timer) {
                    this.onTimer = true;
                    this.execute(line_1);
                    this.game.time.events.add(line_1.timer, function () {
                        _this.execute(line_1, function () {
                            _this.next(true);
                        });
                    }, this).autoDestroy = true;
                }
                else {
                    this.onTimer = false;
                    this.execute(line_1);
                }
            }
        }
    };
    DIALOG_MANAGER.prototype.execute = function (line, callback) {
        if (callback === void 0) { callback = function () { }; }
        if (line !== null) {
            this.dialogGenerator.nextItem(line);
            callback();
        }
        if (line === null) {
            this.dialogGenerator.finished();
        }
    };
    DIALOG_MANAGER.prototype.skipAll = function () {
        if (this.dialogGenerator.isReady) {
            if (this.canSkip) {
                this.dialogGenerator.finished();
            }
        }
    };
    return DIALOG_MANAGER;
}());
var EFFECTS_MANAGER = (function () {
    function EFFECTS_MANAGER() {
    }
    EFFECTS_MANAGER.prototype.assign = function (game, phaserMaster, phaserSprites, phaserGroup, atlas) {
        this.game = game;
        this.phaserSprites = phaserSprites;
        this.phaserMaster = phaserMaster;
        this.phaserGroup = phaserGroup;
        this.atlas = atlas;
        this.currentExplosionCount = 0;
        this.maxExplosions = 5;
        this.currentAmmoCount = 0;
        this.maxAmmo = 3;
    };
    EFFECTS_MANAGER.prototype.debris = function (onscreenCap) {
        var game = this.game;
        var phaserMaster = this.phaserMaster;
        var onscreenDebrisCount = phaserMaster.getOnly(['onscreenDebrisCount']).onscreenDebrisCount;
        var animationSprites = Phaser.Animation.generateFrameNames('debrs__', 1, 9);
        var weapon = game.add.weapon(onscreenCap, this.atlas, animationSprites[0]);
        weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
        weapon.bulletSpeed = 200;
        weapon.bulletSpeedVariance = 500;
        weapon.multiFire = true;
        weapon.bulletPoolTotal = onscreenCap;
        this.phaserGroup.add(this.phaserMaster.get('layers').DEBRIS, weapon.bullets);
        weapon.bullets.children.map(function (bullet) {
            var anim = bullet.animations.add('explosion', animationSprites, 30, true);
        });
        weapon.customFire = function (target, amountOfDebri) {
            for (var i = 0; i < amountOfDebri; i++) {
                weapon.fire(target, target.x + game.rnd.integerInRange(-360, 360), target.y + game.rnd.integerInRange(-360, 360));
            }
            weapon.bullets.children.map(function (bullet, index) {
                game.time.events.add(index * 15, function () {
                    bullet.animations.play('explosion', 30, true);
                    game.add.tween(bullet).to({ alpha: 0 }, 500, Phaser.Easing.Linear.In, true, 500).
                        onComplete.add(function () {
                        bullet.alpha = 1;
                        bullet.kill();
                    });
                }).autoDestroy = true;
            });
        };
        return weapon;
    };
    EFFECTS_MANAGER.prototype.createExplosion = function (x, y, scale, layer, onDestroy, onUpdate) {
        var _this = this;
        if (onDestroy === void 0) { onDestroy = function () { }; }
        if (onUpdate === void 0) { onUpdate = function () { }; }
        if (this.currentExplosionCount < this.maxExplosions) {
            this.currentExplosionCount++;
            var game = this.game;
            var _a = this, phaserSprites_1 = _a.phaserSprites, phaserGroup = _a.phaserGroup, atlas = _a.atlas;
            var data = {
                spriteAnimation: Phaser.Animation.generateFrameNames('explosion2_layer_', 1, 12)
            };
            var explosion_1 = phaserSprites_1.addFromAtlas({ name: "explosion_" + game.rnd.integer(), group: 'noimpactExplosions', x: x, y: y, atlas: atlas, filename: data.spriteAnimation[0] });
            explosion_1.scale.setTo(scale, scale);
            explosion_1.anchor.setTo(0.5, 0.5);
            explosion_1.animations.add('explosion', data.spriteAnimation, 1, true);
            explosion_1.animations.play('explosion', 30, false).onComplete.add(function () {
                explosion_1.destroyIt();
            }, explosion_1);
            explosion_1.destroyIt = function () {
                _this.currentExplosionCount--;
                phaserSprites_1.destroy(explosion_1.name);
            };
            phaserGroup.add(layer === undefined ? this.phaserMaster.get('layers').VISUALS : layer, explosion_1);
            return explosion_1;
        }
    };
    EFFECTS_MANAGER.prototype.pelletImpact = function (x, y, scale, layer) {
        var _this = this;
        if (this.currentAmmoCount < this.maxAmmo) {
            this.currentAmmoCount++;
            var game = this.game;
            var _a = this, phaserSprites_2 = _a.phaserSprites, phaserGroup = _a.phaserGroup, atlas = _a.atlas;
            var data = {
                spriteAnimation: Phaser.Animation.generateFrameNames('sparks_', 1, 5)
            };
            var explosion_2 = phaserSprites_2.addFromAtlas({ name: "impact_" + game.rnd.integer(), group: 'noimpactExplosions', x: x, y: y, atlas: atlas, filename: data.spriteAnimation[0] });
            explosion_2.scale.setTo(scale, scale);
            explosion_2.anchor.setTo(0.5, 0.5);
            explosion_2.animations.add('explosion', data.spriteAnimation, 1, true);
            explosion_2.animations.play('explosion', 30, false).onComplete.add(function () {
                explosion_2.destroyIt();
            }, explosion_2);
            explosion_2.destroyIt = function () {
                _this.currentAmmoCount--;
                phaserSprites_2.destroy(explosion_2.name);
            };
            phaserGroup.add(layer === undefined ? this.phaserMaster.get('layers').BULLET_IMPACT : layer, explosion_2);
            game.physics.enable(explosion_2, Phaser.Physics.ARCADE);
            return explosion_2;
        }
    };
    EFFECTS_MANAGER.prototype.blueImpact = function (x, y, scale, layer) {
        var _this = this;
        if (this.currentAmmoCount < this.maxAmmo) {
            this.currentAmmoCount++;
            var game = this.game;
            var _a = this, phaserSprites_3 = _a.phaserSprites, phaserGroup = _a.phaserGroup, atlas = _a.atlas;
            var data = {
                spriteAnimation: Phaser.Animation.generateFrameNames('blue_explosion_small_layer_', 1, 7)
            };
            var frames_1 = Phaser.Animation.generateFrameNames('blue_explosion_small_layer_', 1, 7);
            var explosion_3 = phaserSprites_3.addFromAtlas({ name: "impact_" + game.rnd.integer(), group: 'noimpactExplosions', x: x, y: y, atlas: atlas, filename: data.spriteAnimation[0] });
            explosion_3.scale.setTo(scale, scale);
            explosion_3.anchor.setTo(0.5, 0.5);
            game.physics.enable(explosion_3, Phaser.Physics.ARCADE);
            explosion_3.animations.add('explosion', data.spriteAnimation, 1, true);
            explosion_3.animations.play('explosion', 30, false).onComplete.add(function () {
                explosion_3.destroyIt();
            }, explosion_3);
            explosion_3.destroyIt = function () {
                _this.currentAmmoCount--;
                phaserSprites_3.destroy(explosion_3.name);
            };
            phaserGroup.add(layer === undefined ? this.phaserMaster.get('layers').BULLET_IMPACT : layer, explosion_3);
            return explosion_3;
        }
    };
    EFFECTS_MANAGER.prototype.orangeImpact = function (x, y, scale, layer) {
        var _this = this;
        if (this.currentAmmoCount < this.maxAmmo) {
            this.currentAmmoCount++;
            var game = this.game;
            var _a = this, phaserSprites_4 = _a.phaserSprites, phaserGroup = _a.phaserGroup, atlas = _a.atlas;
            var data = {
                spriteAnimation: Phaser.Animation.generateFrameNames('orange_ring_explosion_layer_', 1, 7)
            };
            var frames_2 = Phaser.Animation.generateFrameNames('orange_ring_explosion_layer_', 1, 7);
            var explosion_4 = phaserSprites_4.addFromAtlas({ name: "impact_" + game.rnd.integer(), group: 'noimpactExplosions', x: x, y: y, atlas: atlas, filename: data.spriteAnimation[0] });
            explosion_4.scale.setTo(scale, scale);
            explosion_4.anchor.setTo(0.5, 0.5);
            game.physics.enable(explosion_4, Phaser.Physics.ARCADE);
            explosion_4.animations.add('explosion', data.spriteAnimation, 1, true);
            explosion_4.animations.play('explosion', 30, false).onComplete.add(function () {
                explosion_4.destroyIt();
            }, explosion_4);
            explosion_4.destroyIt = function () {
                _this.currentAmmoCount--;
                phaserSprites_4.destroy(explosion_4.name);
            };
            phaserGroup.add(layer === undefined ? this.phaserMaster.get('layers').BULLET_IMPACT : layer, explosion_4);
            return explosion_4;
        }
    };
    EFFECTS_MANAGER.prototype.electricDischarge = function (x, y, scale, layer) {
        var _this = this;
        if (this.currentAmmoCount < this.maxAmmo) {
            this.currentAmmoCount++;
            var game = this.game;
            var _a = this, phaserSprites_5 = _a.phaserSprites, phaserGroup = _a.phaserGroup, atlas = _a.atlas;
            var data = {
                spriteAnimation: Phaser.Animation.generateFrameNames('disintegrate', 1, 10)
            };
            var explosion_5 = phaserSprites_5.addFromAtlas({ name: "impact_" + game.rnd.integer(), group: 'noimpactExplosions', x: x, y: y, atlas: atlas, filename: data.spriteAnimation[0] });
            explosion_5.scale.setTo(scale, scale);
            explosion_5.anchor.setTo(0.5, 0.5);
            game.physics.enable(explosion_5, Phaser.Physics.ARCADE);
            explosion_5.animations.add('explosion', data.spriteAnimation, 1, true);
            explosion_5.animations.play('explosion', game.rnd.integerInRange(20, 30), false).onComplete.add(function () {
                explosion_5.destroyIt();
            }, explosion_5);
            explosion_5.destroyIt = function () {
                _this.currentAmmoCount--;
                phaserSprites_5.destroy(explosion_5.name);
            };
            phaserGroup.add(layer === undefined ? this.phaserMaster.get('layers').BULLET_IMPACT : layer, explosion_5);
            return explosion_5;
        }
    };
    return EFFECTS_MANAGER;
}());
var ENEMY_MANAGER = (function () {
    function ENEMY_MANAGER(params) {
        this.showHitbox = params.showHitbox;
    }
    ENEMY_MANAGER.prototype.assign = function (game, phaserMaster, phaserSprites, phaserTexts, phaserGroup, weaponManager, effectsManager, atlas, atlas_weapons) {
        this.game = game;
        this.phaserSprites = phaserSprites;
        this.phaserMaster = phaserMaster;
        this.phaserTexts = phaserTexts;
        this.phaserGroup = phaserGroup;
        this.weaponManager = weaponManager;
        this.effectsManager = effectsManager;
        this.atlas = atlas;
        this.atlas_weapons = atlas_weapons;
        this.enemyLayer;
    };
    ENEMY_MANAGER.prototype.facePlayer = function (obj) {
        var game = this.game;
        var player = this.phaserSprites.getOnly(['player']).player;
        return Math.ceil((360 / (2 * Math.PI)) * game.math.angleBetween(obj.x, obj.y, player.x, player.y) - 90);
    };
    ENEMY_MANAGER.prototype.generateWaveData = function (duration, range) {
        return this.game.math.sinCosGenerator(duration, range, 0, 1).cos.map(function (value) {
            return Math.abs(value);
        });
    };
    ENEMY_MANAGER.prototype.bulletCollisionWithPlayer = function (enemy) {
        var targets = this.phaserSprites.getGroup('player_hitboxes').slice();
        var collidables = enemy.collidables.primaryWeapon.slice();
        this.game.physics.arcade.overlap(targets, collidables, function (target, collidable) {
            var player = target.parent;
            if (!player.isInvincible && !player.isDead && !player.isDamaged && !player.isForceMoved) {
                player.takeDamage(collidable.damgeOnImpact);
                collidable.destroyIt();
            }
        });
    };
    ENEMY_MANAGER.prototype.addSharedBehavior = function (enemy) {
        var _this = this;
        var _a = this, game = _a.game, phaserSprites = _a.phaserSprites, phaserMaster = _a.phaserMaster, phaserGroup = _a.phaserGroup;
        enemy.onLayer = phaserMaster.get('layers').ENEMIES;
        enemy.anchor.setTo(0.5, 0.5);
        enemy.health = enemy.maxHealth;
        enemy.isInvincible = false;
        enemy.isDamaged = false;
        enemy.isDestroyed = false;
        enemy.belowBlinkTimer = game.time.returnTrueTime();
        enemy.isBelow50 = false;
        enemy.isBelow75 = false;
        enemy.weaponSystems = [];
        enemy.collidables = {
            primaryWeapon: [],
            secondaryWeapon: []
        };
        enemy.removeIt = function () {
            if (!enemy.isDestroyed) {
                enemy.weaponSystems.map(function (weaponSystem) {
                    weaponSystem.destroyIt();
                });
                enemy.children.map(function (obj) {
                    _this.phaserSprites.destroy(obj.name);
                });
                phaserSprites.destroy(enemy.name);
            }
        };
        phaserGroup.add(enemy.onLayer, enemy);
    };
    ENEMY_MANAGER.prototype.attachHitbox = function (enemy, hitboxes) {
        var _this = this;
        var _a = this, game = _a.game, phaserSprites = _a.phaserSprites, atlas = _a.atlas;
        hitboxes.map(function (obj) {
            var e_hitbox = phaserSprites.addFromAtlas({ name: "enemy_hitbox_" + game.rnd.integer(), group: 'enemy_hitboxes', atlas: atlas, filename: obj, alpha: _this.showHitbox ? 0.75 : 0 });
            e_hitbox.anchor.setTo(0.5, 0.5);
            game.physics.enable(e_hitbox, Phaser.Physics.ARCADE);
            enemy.addChild(e_hitbox);
        });
    };
    ENEMY_MANAGER.prototype.attachWeaponSystem = function (enemy, ammo, animationSprites) {
        var _this = this;
        var _a = this, game = _a.game, phaserSprites = _a.phaserSprites, phaserGroup = _a.phaserGroup, atlas = _a.atlas;
        var weaponSystem = this.phaserSprites.addFromAtlas({ name: "enemy_weapons_" + this.game.rnd.integer(), group: 'enemy_weapons', atlas: this.atlas_weapons, filename: animationSprites[0], visible: true });
        weaponSystem.anchor.setTo(0.5, 0.5);
        weaponSystem.angle = 180;
        weaponSystem.animations.add('fireWeapon', animationSprites, 1, true);
        weaponSystem.sync = function (enemy) {
            var x = enemy.x, y = enemy.y;
            weaponSystem.x = x;
            weaponSystem.y = y;
        };
        weaponSystem.destroyIt = function () {
            var x = weaponSystem.x, y = weaponSystem.y;
            _this.effectsManager.blueImpact(x, y, 1, enemy.onLayer);
            _this.phaserSprites.destroy(weaponSystem.name);
            game.time.events.add(Phaser.Timer.SECOND * 4, function () {
                weaponSystem.ammo.destroy();
            }, _this).autoDestroy = true;
        };
        weaponSystem.onUpdate = function () {
            ammo.onUpdate();
        };
        weaponSystem.fire = function () {
            var player = phaserSprites.get('player');
            if (!player.isInvincible && !player.isDead) {
                ammo.fire(weaponSystem, player.x, player.y);
            }
            else {
                ammo.checkOrientation(weaponSystem);
                ammo.fire(weaponSystem);
            }
            weaponSystem.animations.play('fireWeapon', 24, false);
        };
        phaserGroup.add(enemy.onLayer + 1, weaponSystem);
        weaponSystem.ammo = ammo;
        enemy.weaponSystems.push(weaponSystem);
        enemy.collidables.primaryWeapon = [];
        enemy.collidables.primaryWeapon.push(ammo.bullets);
        return weaponSystem;
    };
    ENEMY_MANAGER.prototype.createAsteroid1 = function (options, onDamage, onDestroy, onUpdate) {
        var _this = this;
        if (onDamage === void 0) { onDamage = function () { }; }
        if (onDestroy === void 0) { onDestroy = function () { }; }
        if (onUpdate === void 0) { onUpdate = function () { }; }
        var game = this.game;
        var _a = this, phaserMaster = _a.phaserMaster, phaserSprites = _a.phaserSprites, phaserGroup = _a.phaserGroup, atlas = _a.atlas;
        var folder = 'asteroid1';
        var enemySprites = Phaser.Animation.generateFrameNames(folder + "/asteroid_", 1, 28).slice();
        var enemy = phaserSprites.addFromAtlas({ x: options.x, y: options.y, name: "enemy_" + game.rnd.integer(), group: 'enemies', org: 'gameobjects', atlas: atlas, filename: enemySprites[0], visible: true });
        enemy.maxHealth = 50;
        this.addSharedBehavior(enemy);
        enemy.animations.add('idol', enemySprites);
        enemy.animations.play('idol', 16, true);
        this.attachHitbox(enemy, [folder + "/hitbox"]);
        var ammo = this.weaponManager.enemyBullet(0);
        ammo.bullets.children.map(function (bullet) { });
        var animationSprites = Phaser.Animation.generateFrameNames('bullet_fire_', 1, 4).slice();
        this.attachWeaponSystem(enemy, ammo, animationSprites);
        enemy.onUpdate = function () {
            enemy.y += 2;
            if (enemy.isBelow50) {
                if (game.time.returnTrueTime() > enemy.belowBlinkTimer) {
                    enemy.belowBlinkTimer += 500;
                    enemy.tint = 1 * 0xff0000;
                    enemy.game.add.tween(enemy).to({ tint: 1 * 0xffffff }, 100, Phaser.Easing.Linear.Out, true, 0, 0, false);
                }
            }
            if (enemy.isBelow75) {
                if (game.time.returnTrueTime() > enemy.belowBlinkTimer) {
                    enemy.belowBlinkTimer += 250;
                    enemy.tint = 1 * 0xff0000;
                    enemy.game.add.tween(enemy).to({ tint: 1 * 0xffffff }, 100, Phaser.Easing.Linear.Out, true, 0, 0, false);
                }
            }
            onUpdate(enemy);
            if (enemy.y > (_this.game.world.height + enemy.height)) {
                enemy.removeIt();
            }
            _this.bulletCollisionWithPlayer(enemy);
        };
        enemy.destroyIt = function () {
            enemy.isDestroyed = true;
            enemy.isBelow50 = false;
            enemy.isBelow75 = false;
            enemy.tint = 1 * 0xff0000;
            enemy.weaponSystems.map(function (weaponSystem) {
                weaponSystem.destroyIt();
            });
            enemy.game.add.tween(enemy).to({ alpha: 0.75 }, 150, Phaser.Easing.Linear.Out, true, 1, 0, false).
                onComplete.add(function () {
                onDestroy(enemy);
                _this.weaponManager.createExplosionBasic(enemy.x, enemy.y, 1, enemy.onLayer + 1, 0);
                game.time.events.remove(enemy.explodeInterval);
                enemy.children.map(function (obj) {
                    _this.phaserSprites.destroy(obj.name);
                });
                phaserSprites.destroy(enemy.name);
            });
        };
        enemy.damageIt = function (val) {
            onDamage(enemy);
            enemy.isDamaged = true;
            game.time.events.add(10, function () {
                enemy.isDamaged = false;
            }, _this).autoDestroy = true;
            if (enemy.y > 0) {
                enemy.health -= val;
            }
            enemy.tint = 1 * 0xff0000;
            enemy.game.add.tween(enemy).to({ tint: 1 * 0xffffff }, 100, Phaser.Easing.Linear.Out, true, 0, 0, false);
            if (enemy.health / enemy.maxHealth < 0.5) {
                enemy.isBelow50 = true;
            }
            if (enemy.health / enemy.maxHealth < 0.25) {
                enemy.isBelow75 = true;
            }
            if (enemy.health <= 0) {
                enemy.destroyIt();
            }
        };
        return enemy;
    };
    ENEMY_MANAGER.prototype.createAsteroid2 = function (options, onDamage, onDestroy, onUpdate) {
        var _this = this;
        if (onDamage === void 0) { onDamage = function () { }; }
        if (onDestroy === void 0) { onDestroy = function () { }; }
        if (onUpdate === void 0) { onUpdate = function () { }; }
        var game = this.game;
        var _a = this, phaserMaster = _a.phaserMaster, phaserSprites = _a.phaserSprites, phaserGroup = _a.phaserGroup, atlas = _a.atlas;
        var folder = 'asteroid2';
        var enemySprites = Phaser.Animation.generateFrameNames(folder + "/asteroid_", 1, 19).slice();
        var enemy = phaserSprites.addFromAtlas({ x: options.x, y: options.y, name: "enemy_" + game.rnd.integer(), group: 'enemies', org: 'gameobjects', atlas: atlas, filename: enemySprites[0], visible: true });
        enemy.maxHealth = 150;
        this.addSharedBehavior(enemy);
        enemy.animations.add('idol', enemySprites);
        enemy.animations.play('idol', 12, true);
        this.attachHitbox(enemy, [folder + "/hitbox"]);
        var ammo = this.weaponManager.enemyBullet(0);
        ammo.bullets.children.map(function (bullet) { });
        var animationSprites = Phaser.Animation.generateFrameNames('bullet_fire_', 1, 4).slice();
        this.attachWeaponSystem(enemy, ammo, animationSprites);
        enemy.onUpdate = function () {
            enemy.y += 0.5;
            if (enemy.isBelow50) {
                if (game.time.returnTrueTime() > enemy.belowBlinkTimer) {
                    enemy.belowBlinkTimer += 500;
                    enemy.tint = 1 * 0xff0000;
                    enemy.game.add.tween(enemy).to({ tint: 1 * 0xffffff }, 100, Phaser.Easing.Linear.Out, true, 0, 0, false);
                }
            }
            if (enemy.isBelow75) {
                if (game.time.returnTrueTime() > enemy.belowBlinkTimer) {
                    enemy.belowBlinkTimer += 250;
                    enemy.tint = 1 * 0xff0000;
                    enemy.game.add.tween(enemy).to({ tint: 1 * 0xffffff }, 100, Phaser.Easing.Linear.Out, true, 0, 0, false);
                }
            }
            onUpdate(enemy);
            if (enemy.y > (_this.game.world.height + enemy.height)) {
                enemy.removeIt();
            }
            _this.bulletCollisionWithPlayer(enemy);
        };
        enemy.destroyIt = function () {
            enemy.isDestroyed = true;
            enemy.isBelow50 = false;
            enemy.isBelow75 = false;
            enemy.tint = 1 * 0xff0000;
            enemy.weaponSystems.map(function (weaponSystem) {
                weaponSystem.destroyIt();
            });
            enemy.game.add.tween(enemy).to({ alpha: 0.5 }, 10, Phaser.Easing.Linear.Out, true, 1, 0, false).
                onComplete.add(function () {
                onDestroy(enemy);
                var debris = _this.phaserMaster.get('sharedDebris');
                debris.customFire(enemy, 25);
                game.time.events.remove(enemy.explodeInterval);
                enemy.children.map(function (obj) {
                    _this.phaserSprites.destroy(obj.name);
                });
                phaserSprites.destroy(enemy.name);
            });
        };
        enemy.damageIt = function (val) {
            onDamage(enemy);
            enemy.isDamaged = true;
            game.time.events.add(10, function () {
                enemy.isDamaged = false;
            }, _this).autoDestroy = true;
            enemy.health -= val;
            enemy.tint = 1 * 0xff0000;
            enemy.game.add.tween(enemy).to({ tint: 1 * 0xffffff }, 100, Phaser.Easing.Linear.Out, true, 0, 0, false);
            if (enemy.health / enemy.maxHealth < 0.5) {
                enemy.isBelow50 = true;
            }
            if (enemy.health / enemy.maxHealth < 0.25) {
                enemy.isBelow75 = true;
            }
            if (enemy.health <= 0) {
                enemy.destroyIt();
            }
        };
        return enemy;
    };
    ENEMY_MANAGER.prototype.createSmallEnemy1 = function (options, onDamage, onDestroy, onUpdate) {
        var _this = this;
        if (onDamage === void 0) { onDamage = function () { }; }
        if (onDestroy === void 0) { onDestroy = function () { }; }
        if (onUpdate === void 0) { onUpdate = function () { }; }
        var game = this.game;
        var _a = this, phaserMaster = _a.phaserMaster, phaserSprites = _a.phaserSprites, phaserGroup = _a.phaserGroup, atlas = _a.atlas;
        var folder = 'smallShip';
        var enemySprites = Phaser.Animation.generateFrameNames(folder + "/small_", 1, 1).slice();
        var enemy = phaserSprites.addFromAtlas({ x: options.x, y: options.y, name: "enemy_" + game.rnd.integer(), group: 'enemies', org: 'gameobjects', atlas: atlas, filename: enemySprites[0], visible: true });
        enemy.maxHealth = 50;
        this.addSharedBehavior(enemy);
        enemy.yWave = { data: this.generateWaveData(200, game.world.height * .60), count: 0 };
        enemy.fireDelay = 0;
        enemy.fireTimer = 1000;
        phaserGroup.add(enemy.onLayer, enemy);
        this.attachHitbox(enemy, [folder + "/hitbox"]);
        var ammo = this.weaponManager.enemyBullet(3);
        ammo.bullets.children.map(function (bullet) { });
        var animationSprites = Phaser.Animation.generateFrameNames('bullet_fire_', 1, 4).slice();
        var weaponSystem = this.attachWeaponSystem(enemy, ammo, animationSprites);
        enemy.onUpdate = function () {
            enemy.angle = _this.facePlayer(enemy);
            enemy.weaponSystems.map(function (weaponsSystem) {
                weaponsSystem.angle = _this.facePlayer(enemy) - 180;
            });
            if (game.time.returnTrueTime() > enemy.fireDelay && !enemy.isDestroyed && (enemy.y > enemy.game.canvas.height * .4)) {
                enemy.fireDelay = game.time.returnTrueTime() + enemy.fireTimer;
                enemy.weaponSystems.map(function (weaponsSystem) {
                    weaponSystem.fire();
                });
            }
            if (!enemy.isDestroyed) {
                enemy.y = enemy.yWave.data[enemy.yWave.count] - enemy.height;
                enemy.yWave.count++;
                if (enemy.yWave.count >= enemy.yWave.data.length) {
                    enemy.removeIt();
                }
                enemy.weaponSystems.map(function (obj) {
                    obj.sync(enemy);
                });
            }
            if (enemy.isBelow50) {
                if (game.time.returnTrueTime() > enemy.belowBlinkTimer) {
                    enemy.belowBlinkTimer += 500;
                    enemy.tint = 1 * 0xff0000;
                    enemy.game.add.tween(enemy).to({ tint: 1 * 0xffffff }, 100, Phaser.Easing.Linear.Out, true, 0, 0, false);
                }
            }
            if (enemy.isBelow75) {
                if (game.time.returnTrueTime() > enemy.belowBlinkTimer) {
                    enemy.belowBlinkTimer += 250;
                    enemy.tint = 1 * 0xff0000;
                    enemy.game.add.tween(enemy).to({ tint: 1 * 0xffffff }, 100, Phaser.Easing.Linear.Out, true, 0, 0, false);
                }
            }
            onUpdate(enemy);
            if (enemy.y > (_this.game.world.height + enemy.height)) {
                enemy.removeIt();
            }
            _this.bulletCollisionWithPlayer(enemy);
        };
        enemy.damageIt = function (val) {
            onDamage(enemy);
            enemy.isDamaged = true;
            game.time.events.add(10, function () {
                enemy.isDamaged = false;
            }, _this).autoDestroy = true;
            enemy.health -= val;
            enemy.tint = 1 * 0xff0000;
            enemy.game.add.tween(enemy).to({ tint: 1 * 0xffffff }, 100, Phaser.Easing.Linear.Out, true, 0, 0, false);
            if (enemy.health <= 0) {
                enemy.destroyIt();
            }
        };
        enemy.removeIt = function () {
            enemy.weaponSystems.map(function (weaponSystem) {
                weaponSystem.destroyIt();
            });
            enemy.children.map(function (obj) {
                _this.phaserSprites.destroy(obj.name);
            });
            phaserSprites.destroy(enemy.name);
        };
        enemy.destroyIt = function () {
            enemy.isDestroyed = true;
            enemy.tint = 1 * 0xff0000;
            enemy.weaponSystems.map(function (weaponSystem) {
                weaponSystem.destroyIt();
            });
            enemy.explodeInterval = game.time.events.loop(250, function () {
                _this.effectsManager.createExplosion(enemy.x + game.rnd.integerInRange(-enemy.width / 2, enemy.width / 2), enemy.y + game.rnd.integerInRange(-enemy.height / 2, enemy.height / 2), 1, enemy.onLayer + 1);
            });
            enemy.game.add.tween(enemy).to({ y: enemy.y + 50, alpha: 0.5 }, 500, Phaser.Easing.Linear.Out, true, 250, 0, false).
                onComplete.add(function () {
                var debris = _this.phaserMaster.get('sharedDebris');
                debris.customFire(enemy, 25);
                onDestroy(enemy);
                game.time.events.remove(enemy.explodeInterval);
                enemy.children.map(function (obj) {
                    _this.phaserSprites.destroy(obj.name);
                });
                phaserSprites.destroy(enemy.name);
            });
        };
        return enemy;
    };
    ENEMY_MANAGER.prototype.createSmallEnemy2 = function (options, onDamage, onDestroy, onUpdate) {
        var _this = this;
        if (onDamage === void 0) { onDamage = function () { }; }
        if (onDestroy === void 0) { onDestroy = function () { }; }
        if (onUpdate === void 0) { onUpdate = function () { }; }
        var game = this.game;
        var _a = this, phaserMaster = _a.phaserMaster, phaserSprites = _a.phaserSprites, phaserGroup = _a.phaserGroup, atlas = _a.atlas;
        var enemy = phaserSprites.addFromAtlas({ name: "enemy_" + game.rnd.integer(), group: 'enemies', org: 'gameobjects', atlas: atlas, filename: "big_1", visible: true, x: options.x });
        enemy.anchor.setTo(0.5, 0.5);
        enemy.scale.setTo(1, 1);
        enemy.maxHealth = 700;
        enemy.health = enemy.maxHealth;
        enemy.pierceResistence = 1;
        enemy.fallThreshold = game.rnd.integerInRange(0, 75);
        enemy.cosWave = { data: game.math.sinCosGenerator(400, game.world.height * .50, 0, 1).cos, count: 0 };
        enemy.fireDelay = 0;
        enemy.fireTimer = 200;
        enemy.isInvincible = false;
        enemy.isDamaged = false;
        enemy.isDestroyed = false;
        enemy.onLayer = phaserMaster.get('layers').ENEMIES;
        enemy.bulletCycle = {
            count: 0,
            total: 3,
            delay: 500,
            lock: false
        };
        enemy.weaponSystems = [];
        enemy.collidables = {
            primaryWeapon: [],
            secondaryWeapon: []
        };
        phaserGroup.add(enemy.onLayer, enemy);
        var hitboxes = ["big_1_hitbox_1", "big_1_hitbox_2"];
        hitboxes.map(function (obj) {
            var e_hitbox = phaserSprites.addFromAtlas({ name: "enemy_hitbox_" + game.rnd.integer(), group: 'enemy_hitboxes', atlas: atlas, filename: obj, alpha: _this.showHitbox ? 0.75 : 0 });
            e_hitbox.anchor.setTo(0.5, 0.5);
            game.physics.enable(e_hitbox, Phaser.Physics.ARCADE);
            enemy.addChild(e_hitbox);
        });
        var ammo = this.weaponManager.enemyBullet(9);
        ammo.bullets.children.map(function (bullet) {
            bullet.damgeOnImpact = 10;
        });
        var animationSprites = Phaser.Animation.generateFrameNames('bullet_fire_', 1, 4).slice();
        var weaponSystem = this.phaserSprites.addFromAtlas({ name: "enemy_weapons_" + this.game.rnd.integer(), group: 'enemy_weapons', atlas: this.atlas_weapons, filename: animationSprites[0], visible: true });
        weaponSystem.anchor.setTo(0.5, 0.5);
        weaponSystem.angle = 180;
        weaponSystem.animations.add('fireWeapon', animationSprites, 1, true);
        weaponSystem.sync = function (enemy) {
            var x = enemy.x, y = enemy.y;
            weaponSystem.x = x;
            weaponSystem.y = y;
        };
        weaponSystem.destroyIt = function () {
            var x = weaponSystem.x, y = weaponSystem.y;
            _this.effectsManager.blueImpact(x, y, 1, enemy.onLayer);
            _this.phaserSprites.destroy(weaponSystem.name);
            game.time.events.add(Phaser.Timer.SECOND * 4, function () {
                weaponSystem.ammo.destroy();
            }, _this).autoDestroy = true;
        };
        weaponSystem.fire = function () {
            var player = phaserSprites.get('player');
            ammo.fire(weaponSystem, weaponSystem.x, weaponSystem.y + 100);
            ammo.fire(weaponSystem, weaponSystem.x + 50, weaponSystem.y + 100);
            ammo.fire(weaponSystem, weaponSystem.x - 50, weaponSystem.y + 100);
            weaponSystem.animations.play('fireWeapon', 24, false);
        };
        phaserGroup.add(enemy.onLayer + 1, weaponSystem);
        weaponSystem.ammo = ammo;
        enemy.weaponSystems.push(weaponSystem);
        enemy.collidables.primaryWeapon = [];
        enemy.collidables.primaryWeapon.push(ammo.bullets);
        enemy.onUpdate = function () {
            var player = phaserSprites.get('player');
            onUpdate(enemy);
            if (game.time.returnTrueTime() > enemy.fireDelay && !enemy.isDestroyed && (enemy.y > enemy.game.canvas.height * .3)) {
                enemy.fireDelay = game.time.returnTrueTime() + enemy.fireTimer;
                if (enemy.bulletCycle.count < enemy.bulletCycle.total) {
                    enemy.weaponSystems.map(function (weaponsSystem) {
                        weaponSystem.fire();
                    });
                    enemy.bulletCycle.count++;
                }
                else {
                    if (!enemy.bulletCycle.lock) {
                        enemy.bulletCycle.lock = true;
                        game.time.events.add(Phaser.Timer.SECOND * 1.5, function () {
                            enemy.bulletCycle.count = 0;
                            enemy.bulletCycle.lock = false;
                        }).autoDestroy = true;
                    }
                }
            }
            if (!enemy.isDestroyed) {
                if (enemy.cosWave.count < enemy.cosWave.data.length / 2) {
                    enemy.y = -(enemy.cosWave.data[enemy.cosWave.count]) - enemy.height;
                    enemy.cosWave.count++;
                }
                if (enemy.cosWave.count >= enemy.cosWave.data.length) {
                    enemy.removeIt();
                }
                enemy.weaponSystems.map(function (obj) {
                    obj.sync(enemy);
                });
            }
            _this.bulletCollisionWithPlayer(enemy);
        };
        enemy.damageIt = function (val) {
            onDamage(enemy);
            enemy.isDamaged = true;
            game.time.events.add(10, function () {
                enemy.isDamaged = false;
            }, _this).autoDestroy = true;
            enemy.health -= val;
            enemy.tint = 1 * 0xff0000;
            enemy.game.add.tween(enemy).to({ tint: 1 * 0xffffff }, 100, Phaser.Easing.Linear.Out, true, 0, 0, false);
            if (enemy.health <= 0) {
                enemy.destroyIt();
            }
        };
        enemy.removeIt = function () {
            enemy.weaponSystems.map(function (weaponSystem) {
                weaponSystem.destroyIt();
            });
            enemy.children.map(function (obj) {
                _this.phaserSprites.destroy(obj.name);
            });
            phaserSprites.destroy(enemy.name);
        };
        enemy.destroyIt = function () {
            enemy.isDestroyed = true;
            enemy.tint = 1 * 0xff0000;
            enemy.weaponSystems.map(function (weaponSystem) {
                weaponSystem.destroyIt();
            });
            enemy.explodeInterval = game.time.events.loop(500, function () {
                _this.effectsManager.createExplosion(enemy.x + game.rnd.integerInRange(-enemy.width / 2, enemy.width / 2), enemy.y + game.rnd.integerInRange(-enemy.height / 2, enemy.height / 2), 1, enemy.onLayer + 1);
            });
            enemy.game.add.tween(enemy.scale).to({ x: 0.85, y: 0.85 }, 500, Phaser.Easing.Linear.Out, true, 500, 0, false).
                onComplete.add(function () {
                _this.weaponManager.createExplosionVacuum(enemy.x, enemy.y, 1.5, enemy.onLayer + 1, 10);
                var debris = _this.phaserMaster.get('sharedDebris');
                debris.customFire(enemy, 50);
                game.time.events.remove(enemy.explodeInterval);
                onDestroy(enemy);
                enemy.children.map(function (obj) {
                    _this.phaserSprites.destroy(obj.name);
                });
                phaserSprites.destroy(enemy.name);
            });
        };
        return enemy;
    };
    ENEMY_MANAGER.prototype.createBoss1 = function (options, onDamage, onDestroy, onUpdate) {
        var _this = this;
        if (onDamage === void 0) { onDamage = function () { }; }
        if (onDestroy === void 0) { onDestroy = function () { }; }
        if (onUpdate === void 0) { onUpdate = function () { }; }
        var game = this.game;
        var _a = this, phaserMaster = _a.phaserMaster, phaserSprites = _a.phaserSprites, phaserGroup = _a.phaserGroup, atlas = _a.atlas;
        var enemy = phaserSprites.addFromAtlas({ name: "enemy_" + game.rnd.integer(), group: 'enemies', org: 'gameobjects', atlas: atlas, filename: "big_1", visible: true, x: options.x });
        enemy.anchor.setTo(0.5, 0.5);
        enemy.scale.setTo(1, 1);
        enemy.maxHealth = 15000;
        enemy.health = enemy.maxHealth;
        enemy.pierceResistence = 1;
        enemy.fallThreshold = game.rnd.integerInRange(0, 75);
        enemy.cosWave = { data: game.math.sinCosGenerator(400, game.world.height * .50, 0, 1).cos, count: 0 };
        enemy.fireDelay = 0;
        enemy.fireTimer = 200;
        enemy.isInvincible = false;
        enemy.isDamaged = false;
        enemy.isDestroyed = false;
        enemy.onLayer = phaserMaster.get('layers').ENEMIES;
        enemy.bulletCycle = {
            count: 0,
            total: 3,
            delay: 500,
            lock: false
        };
        enemy.weaponSystems = [];
        enemy.collidables = {
            primaryWeapon: [],
            secondaryWeapon: []
        };
        enemy.trackinbox = null;
        phaserGroup.add(enemy.onLayer, enemy);
        var hitboxes = ["big_1_hitbox_1", "big_1_hitbox_2"];
        hitboxes.map(function (obj) {
            var e_hitbox = phaserSprites.addFromAtlas({ name: "enemy_hitbox_" + game.rnd.integer(), group: 'enemy_hitboxes', atlas: atlas, filename: obj, alpha: _this.showHitbox ? 0.75 : 0 });
            e_hitbox.anchor.setTo(0.5, 0.5);
            game.physics.enable(e_hitbox, Phaser.Physics.ARCADE);
            enemy.addChild(e_hitbox);
        });
        var targetingBox = phaserSprites.addFromAtlas({ name: "targetingBox_" + game.rnd.integer(), group: 'enemy_hitboxes', width: enemy.width, height: enemy.height, atlas: atlas, filename: hitboxes[0], alpha: this.showHitbox ? 0.75 : 0 });
        targetingBox.anchor.setTo(0.5, 0.5);
        targetingBox.sync = function () {
            var player = phaserSprites.get('player');
            targetingBox.x = enemy.x;
            targetingBox.y = enemy.y;
            targetingBox.angle = Math.ceil((360 / (2 * Math.PI)) * game.math.angleBetween(targetingBox.x, targetingBox.y, player.x, player.y) - 90);
        };
        enemy.targetingBox = targetingBox;
        var ammo = this.weaponManager.enemyBullet(9);
        ammo.bullets.children.map(function (bullet) {
            bullet.damgeOnImpact = 10;
        });
        var animationSprites = Phaser.Animation.generateFrameNames('bullet_fire_', 1, 4).slice();
        var weaponSystem = this.phaserSprites.addFromAtlas({ name: "enemy_weapons_" + this.game.rnd.integer(), group: 'enemy_weapons', atlas: this.atlas_weapons, filename: animationSprites[0], visible: true });
        weaponSystem.anchor.setTo(0.5, 0.5);
        weaponSystem.angle = 180;
        weaponSystem.animations.add('fireWeapon', animationSprites, 1, true);
        weaponSystem.sync = function (enemy) {
            var x = enemy.x, y = enemy.y;
            weaponSystem.x = x;
            weaponSystem.y = y;
        };
        weaponSystem.destroyIt = function () {
            var x = weaponSystem.x, y = weaponSystem.y;
            _this.effectsManager.blueImpact(x, y, 1, enemy.onLayer);
            _this.phaserSprites.destroy(weaponSystem.name);
            game.time.events.add(Phaser.Timer.SECOND * 4, function () {
                weaponSystem.ammo.destroy();
            }, _this).autoDestroy = true;
        };
        weaponSystem.fire = function () {
            var player = phaserSprites.get('player');
            ammo.fire(weaponSystem, weaponSystem.x, weaponSystem.y + 100);
            ammo.fire(weaponSystem, weaponSystem.x + 50, weaponSystem.y + 100);
            ammo.fire(weaponSystem, weaponSystem.x - 50, weaponSystem.y + 100);
            weaponSystem.animations.play('fireWeapon', 24, false);
        };
        phaserGroup.add(enemy.onLayer + 1, weaponSystem);
        weaponSystem.ammo = ammo;
        enemy.weaponSystems.push(weaponSystem);
        enemy.collidables.primaryWeapon = [];
        enemy.collidables.primaryWeapon.push(ammo.bullets);
        enemy.onUpdate = function () {
            var player = phaserSprites.get('player');
            onUpdate(enemy);
            targetingBox.sync();
            if (game.time.returnTrueTime() > enemy.fireDelay && !enemy.isDestroyed && (enemy.y > enemy.game.canvas.height * .3)) {
                enemy.fireDelay = game.time.returnTrueTime() + enemy.fireTimer;
                if (enemy.bulletCycle.count < enemy.bulletCycle.total) {
                    enemy.weaponSystems.map(function (weaponsSystem) {
                        weaponSystem.fire();
                    });
                    enemy.bulletCycle.count++;
                }
                else {
                    if (!enemy.bulletCycle.lock) {
                        enemy.bulletCycle.lock = true;
                        game.time.events.add(Phaser.Timer.SECOND * 1.5, function () {
                            enemy.bulletCycle.count = 0;
                            enemy.bulletCycle.lock = false;
                        }).autoDestroy = true;
                    }
                }
            }
            if (!enemy.isDestroyed) {
                if (enemy.cosWave.count < enemy.cosWave.data.length / 2) {
                    enemy.y = -(enemy.cosWave.data[enemy.cosWave.count]) - enemy.height;
                    enemy.cosWave.count++;
                }
                if (enemy.cosWave.count >= enemy.cosWave.data.length) {
                    enemy.removeIt();
                }
                enemy.weaponSystems.map(function (obj) {
                    obj.sync(enemy);
                });
            }
            _this.bulletCollisionWithPlayer(enemy);
        };
        enemy.damageIt = function (val) {
            onDamage(enemy);
            enemy.isDamaged = true;
            game.time.events.add(10, function () {
                enemy.isDamaged = false;
            }, _this).autoDestroy = true;
            enemy.health -= val;
            enemy.tint = 1 * 0xff0000;
            enemy.game.add.tween(enemy).to({ tint: 1 * 0xffffff }, 100, Phaser.Easing.Linear.Out, true, 0, 0, false);
            if (enemy.health <= 0) {
                enemy.destroyIt();
            }
        };
        enemy.removeIt = function () {
            enemy.weaponSystems.map(function (weaponSystem) {
                weaponSystem.destroyIt();
            });
            enemy.children.map(function (obj) {
                _this.phaserSprites.destroy(obj.name);
            });
            phaserSprites.destroy(enemy.name);
        };
        enemy.destroyIt = function () {
            enemy.isDestroyed = true;
            enemy.tint = 1 * 0xff0000;
            enemy.weaponSystems.map(function (weaponSystem) {
                weaponSystem.destroyIt();
            });
            phaserSprites.destroy(targetingBox.name);
            _this.weaponManager.createExplosionVacuum(enemy.x, enemy.y, 2, enemy.onLayer + 1, 10);
            enemy.game.add.tween(enemy).to({ y: enemy.y - 100 }, 6000, Phaser.Easing.Linear.Out, true, 0, 0, false);
            game.time.events.add(Phaser.Timer.SECOND * 2, function () {
                enemy.explodeInterval = game.time.events.loop(150, function () {
                    enemy.tint = 1 * 0xff0000;
                    enemy.game.add.tween(enemy).to({ tint: 1 * 0xffffff }, 50, Phaser.Easing.Linear.Out, true, 0, 0, false);
                    _this.effectsManager.createExplosion(enemy.x + game.rnd.integerInRange(-enemy.width / 2, enemy.width / 2), enemy.y + game.rnd.integerInRange(-enemy.height / 2, enemy.height / 2), 1, enemy.onLayer + 1);
                });
                onDestroy(enemy);
                enemy.game.add.tween(enemy.scale).to({ x: 0.75, y: 0.75 }, 4500, Phaser.Easing.Linear.Out, true, 0, 0, false).
                    onComplete.add(function () {
                    _this.weaponManager.createExplosionVacuum(enemy.x, enemy.y, 1.5, enemy.onLayer + 1, 10);
                    var debris = _this.phaserMaster.get('sharedDebris');
                    debris.customFire(enemy);
                    game.time.events.remove(enemy.explodeInterval);
                    enemy.children.map(function (obj) {
                        _this.phaserSprites.destroy(obj.name);
                    });
                    phaserSprites.destroy(enemy.name);
                });
            }).autoDestroy = true;
        };
        return enemy;
    };
    return ENEMY_MANAGER;
}());
var ITEMSPAWN_MANAGER = (function () {
    function ITEMSPAWN_MANAGER() {
    }
    ITEMSPAWN_MANAGER.prototype.assign = function (game, phaserMaster, phaserSprites, phaserGroup, atlas) {
        this.game = game;
        this.phaserSprites = phaserSprites;
        this.phaserMaster = phaserMaster;
        this.phaserGroup = phaserGroup;
        this.atlas = atlas;
    };
    ITEMSPAWN_MANAGER.prototype.getDistanceFromPlayer = function (obj) {
        var player = this.phaserSprites.get('player');
        if (player.isForceMoved) {
            return 0;
        }
        else {
            return Math.round(Phaser.Math.distance(player.x, player.y, obj.x, obj.y));
        }
    };
    ITEMSPAWN_MANAGER.prototype.spawnHealthpack = function (x, y, layer, onPickup) {
        var _this = this;
        if (onPickup === void 0) { onPickup = function () { }; }
        var animation = Phaser.Animation.generateFrameNames('healthpack_', 1, 4).slice();
        var item = this.phaserSprites.addFromAtlas({ name: "healthpack_" + this.game.rnd.integer(), group: 'itemspawns', x: x, y: y, atlas: this.atlas, filename: animation[0] });
        item.animations.add('animate', animation, 8, true);
        item.animations.play('animate');
        item.anchor.setTo(0.5, 0.5);
        item.blinkLifespan = this.game.time.returnTrueTime() + (Phaser.Timer.SECOND * 10);
        item.blinkLifespanInterval = this.game.time.returnTrueTime();
        item.blinkLifespanCount = 0;
        this.game.physics.enable(item, Phaser.Physics.ARCADE);
        item.body.collideWorldBounds = true;
        item.body.bounce.setTo(1, 1);
        item.body.velocity.y = this.game.rnd.integerInRange(50, 50);
        item.body.velocity.x = this.game.rnd.integerInRange(-200, 200);
        item.destroyIt = function () {
            _this.phaserSprites.destroy(item.name);
        };
        item.pickedUp = function () {
            _this.phaserSprites.destroy(item.name);
        };
        item.onUpdate = function () {
            if (_this.getDistanceFromPlayer(item) < 200) {
                var player = _this.phaserSprites.get('player');
                _this.game.physics.arcade.moveToObject(item, player, 400);
            }
            if (_this.game.time.returnTrueTime() > item.blinkLifespan) {
                item.destroyIt();
            }
            if (_this.game.time.returnTrueTime() > (item.blinkLifespan - Phaser.Timer.SECOND * 3)) {
                if (_this.game.time.returnTrueTime() > item.blinkLifespanInterval) {
                    item.blinkLifespanInterval = _this.game.time.returnTrueTime() + 200 - (item.blinkLifespanCount * 5);
                    item.alpha = item.blinkLifespanCount % 2 === 0 ? 0.25 : 1;
                    item.blinkLifespanCount++;
                }
            }
            _this.phaserSprites.getManyGroups(['playership']).map(function (target) {
                target.game.physics.arcade.overlap(item, target, function (obj, target) {
                    onPickup();
                    item.pickedUp();
                }, null, item);
            });
        };
        this.phaserGroup.add(this.phaserMaster.get('layers').ITEMDROPS, item);
    };
    ITEMSPAWN_MANAGER.prototype.spawnPowerup = function (x, y, layer, onPickup) {
        var _this = this;
        if (onPickup === void 0) { onPickup = function () { }; }
        var animation = Phaser.Animation.generateFrameNames('powerup_', 1, 4).slice();
        var item = this.phaserSprites.addFromAtlas({ name: "healthpack_" + this.game.rnd.integer(), group: 'itemspawns', x: x, y: y, atlas: this.atlas, filename: animation[0] });
        item.animations.add('animate', animation, 8, true);
        item.animations.play('animate');
        item.anchor.setTo(0.5, 0.5);
        item.blinkLifespan = this.game.time.returnTrueTime() + (Phaser.Timer.SECOND * 10);
        item.blinkLifespanInterval = this.game.time.returnTrueTime();
        item.blinkLifespanCount = 0;
        this.game.physics.enable(item, Phaser.Physics.ARCADE);
        item.body.collideWorldBounds = true;
        item.body.bounce.setTo(1, 1);
        item.body.velocity.y = this.game.rnd.integerInRange(50, 50);
        item.body.velocity.x = this.game.rnd.integerInRange(-200, 200);
        item.destroyIt = function () {
            _this.phaserSprites.destroy(item.name);
        };
        item.pickedUp = function () {
            _this.phaserSprites.destroy(item.name);
        };
        item.onUpdate = function () {
            if (_this.getDistanceFromPlayer(item) < 200) {
                var player = _this.phaserSprites.get('player');
                _this.game.physics.arcade.moveToObject(item, player, 400);
            }
            if (_this.game.time.returnTrueTime() > item.blinkLifespan) {
                item.destroyIt();
            }
            if (_this.game.time.returnTrueTime() > (item.blinkLifespan - Phaser.Timer.SECOND * 3)) {
                if (_this.game.time.returnTrueTime() > item.blinkLifespanInterval) {
                    item.blinkLifespanInterval = _this.game.time.returnTrueTime() + 200 - (item.blinkLifespanCount * 5);
                    item.alpha = item.blinkLifespanCount % 2 === 0 ? 0.25 : 1;
                    item.blinkLifespanCount++;
                }
            }
            _this.phaserSprites.getManyGroups(['playership']).map(function (target) {
                target.game.physics.arcade.overlap(item, target, function (obj, target) {
                    onPickup();
                    item.pickedUp();
                }, null, item);
            });
        };
        this.phaserGroup.add(this.phaserMaster.get('layers').ITEMDROPS, item);
    };
    ITEMSPAWN_MANAGER.prototype.spawnSpecial = function (x, y, layer, onPickup) {
        var _this = this;
        if (onPickup === void 0) { onPickup = function () { }; }
        var animation = Phaser.Animation.generateFrameNames('special_', 1, 5).slice();
        var item = this.phaserSprites.addFromAtlas({ name: "healthpack_" + this.game.rnd.integer(), group: 'itemspawns', x: x, y: y, atlas: this.atlas, filename: animation[0] });
        item.animations.add('animate', animation, 8, true);
        item.animations.play('animate');
        item.anchor.setTo(0.5, 0.5);
        item.blinkLifespan = this.game.time.returnTrueTime() + (Phaser.Timer.SECOND * 10);
        item.blinkLifespanInterval = this.game.time.returnTrueTime();
        item.blinkLifespanCount = 0;
        this.game.physics.enable(item, Phaser.Physics.ARCADE);
        item.body.collideWorldBounds = true;
        item.body.bounce.setTo(1, 1);
        item.body.velocity.y = this.game.rnd.integerInRange(50, 50);
        item.body.velocity.x = this.game.rnd.integerInRange(-200, 200);
        item.destroyIt = function () {
            _this.phaserSprites.destroy(item.name);
        };
        item.pickedUp = function () {
            _this.phaserSprites.destroy(item.name);
        };
        item.onUpdate = function () {
            if (_this.getDistanceFromPlayer(item) < 200) {
                var player = _this.phaserSprites.get('player');
                _this.game.physics.arcade.moveToObject(item, player, 400);
            }
            if (_this.game.time.returnTrueTime() > item.blinkLifespan) {
                item.destroyIt();
            }
            if (_this.game.time.returnTrueTime() > (item.blinkLifespan - Phaser.Timer.SECOND * 3)) {
                if (_this.game.time.returnTrueTime() > item.blinkLifespanInterval) {
                    item.blinkLifespanInterval = _this.game.time.returnTrueTime() + 200 - (item.blinkLifespanCount * 5);
                    item.alpha = item.blinkLifespanCount % 2 === 0 ? 0.25 : 1;
                    item.blinkLifespanCount++;
                }
            }
            _this.phaserSprites.getManyGroups(['playership']).map(function (target) {
                target.game.physics.arcade.overlap(item, target, function (obj, target) {
                    onPickup();
                    item.pickedUp();
                }, null, item);
            });
        };
        this.phaserGroup.add(this.phaserMaster.get('layers').ITEMDROPS, item);
    };
    ITEMSPAWN_MANAGER.prototype.spawnScrap = function (x, y, layer, onPickup) {
        var _this = this;
        if (onPickup === void 0) { onPickup = function () { }; }
        var animation = Phaser.Animation.generateFrameNames('scrap_', 1, 1).slice();
        var item = this.phaserSprites.addFromAtlas({ name: "healthpack_" + this.game.rnd.integer(), group: 'itemspawns', x: x, y: y, atlas: this.atlas, filename: animation[0] });
        if (animation.length > 1) {
            item.animations.add('animate', animation, 8, true);
            item.animations.play('animate');
        }
        item.anchor.setTo(0.5, 0.5);
        item.blinkLifespan = this.game.time.returnTrueTime() + (Phaser.Timer.SECOND * 10);
        item.blinkLifespanInterval = this.game.time.returnTrueTime();
        item.blinkLifespanCount = 0;
        this.game.physics.enable(item, Phaser.Physics.ARCADE);
        item.body.collideWorldBounds = true;
        item.body.bounce.setTo(1, 1);
        item.body.velocity.y = this.game.rnd.integerInRange(50, 50);
        item.body.velocity.x = this.game.rnd.integerInRange(-200, 200);
        item.destroyIt = function () {
            _this.phaserSprites.destroy(item.name);
        };
        item.pickedUp = function () {
            _this.phaserSprites.destroy(item.name);
        };
        item.onUpdate = function () {
            if (_this.getDistanceFromPlayer(item) < 200) {
                var player = _this.phaserSprites.get('player');
                _this.game.physics.arcade.moveToObject(item, player, 400);
            }
            if (_this.game.time.returnTrueTime() > item.blinkLifespan) {
                item.destroyIt();
            }
            if (_this.game.time.returnTrueTime() > (item.blinkLifespan - Phaser.Timer.SECOND * 3)) {
                if (_this.game.time.returnTrueTime() > item.blinkLifespanInterval) {
                    item.blinkLifespanInterval = _this.game.time.returnTrueTime() + 200 - (item.blinkLifespanCount * 5);
                    item.alpha = item.blinkLifespanCount % 2 === 0 ? 0.25 : 1;
                    item.blinkLifespanCount++;
                }
            }
            _this.phaserSprites.getManyGroups(['playership']).map(function (target) {
                target.game.physics.arcade.overlap(item, target, function (obj, target) {
                    onPickup();
                    item.pickedUp();
                }, null, item);
            });
        };
        this.phaserGroup.add(this.phaserMaster.get('layers').ITEMDROPS, item);
    };
    return ITEMSPAWN_MANAGER;
}());
var PLAYER_MANAGER = (function () {
    function PLAYER_MANAGER() {
    }
    PLAYER_MANAGER.prototype.assign = function (game, phaserMaster, phaserSprites, phaserTexts, phaserGroup, phaserControls, weaponManager, effectsManager, atlas, weaponAtlas) {
        this.game = game;
        this.phaserSprites = phaserSprites;
        this.phaserMaster = phaserMaster;
        this.phaserTexts = phaserTexts;
        this.phaserGroup = phaserGroup;
        this.phaserControls = phaserControls;
        this.weaponManager = weaponManager;
        this.effectsManager = effectsManager;
        this.atlas = atlas;
        this.weaponAtlas = weaponAtlas;
        this.player = null;
    };
    PLAYER_MANAGER.prototype.createShip = function (params, updateHealth, onDamage, loseLife, onUpdate) {
        var _this = this;
        if (updateHealth === void 0) { updateHealth = function () { }; }
        if (onDamage === void 0) { onDamage = function () { }; }
        if (loseLife === void 0) { loseLife = function () { }; }
        if (onUpdate === void 0) { onUpdate = function () { }; }
        var game = this.game;
        var shipId = params.shipId + 1;
        var gameData = this.phaserMaster.getOnly(['gameData']).gameData;
        var starMomentum = this.phaserMaster.getOnly(['starMomentum']).starMomentum;
        var player = this.phaserSprites.addFromAtlas({ x: this.game.world.centerX, y: 2000, name: params.name, group: params.group, org: params.org, atlas: this.atlas, filename: "ship_base_form" });
        player.anchor.setTo(0.5, 0.5);
        player.scale.setTo(1, 1);
        player.isInvincible = false;
        player.isDead = true;
        player.isDamaged = false;
        player.isForceMoved = false;
        player.ignoreBoundaries = null;
        player.onLayer = params.layer;
        player.primaryWeapon = params.primaryWeapon;
        player.secondaryWeapon = params.secondaryWeapon;
        player.perk = params.perk;
        player.explodeInterval = null;
        player.weaponSystems = [];
        player.subweaponSystems = [];
        player.attachments = [];
        player.xCapture = [];
        player.yCapture = [];
        player.clearEnemyBulletsInterval;
        player.collidables = {
            primaryWeapon: [],
            secondaryWeapon: []
        };
        var shipStart = Phaser.Animation.generateFrameNames("ship_start_", 1, 7).slice();
        var shipDamage = ['ship_damage', 'ship_damage', 'ship_damage', 'ship_damage', 'ship_start_7'];
        var preExplode = Phaser.Animation.generateFrameNames("ship_explode_", 1, 5).slice();
        var preExplodeLoop = Phaser.Animation.generateFrameNames("ship_explode_", 6, 7).slice();
        player.animations.add('shipDamage', shipDamage, 1, true);
        player.animations.add('shipStart', shipStart, 1, true);
        player.animations.add('preExplode', preExplode, 1, true);
        player.animations.add('preExplodeLoop', preExplodeLoop, 1, true);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        this.phaserGroup.add(this.phaserMaster.get('layers').PLAYER, player);
        var hitboxes = ["ship_hitbox_1", "ship_hitbox_2"];
        hitboxes.map(function (obj, index) {
            var p_hitbox = _this.phaserSprites.addFromAtlas({ y: 10, name: "player_hitbox_" + game.rnd.integer(), group: 'player_hitboxes', atlas: _this.atlas, filename: obj, alpha: 0 });
            p_hitbox.anchor.setTo(0.5, 0.5);
            game.physics.enable(p_hitbox, Phaser.Physics.ARCADE);
            player.addChild(p_hitbox);
        });
        var targetingBox = this.phaserSprites.addFromAtlas({ name: "mock_trackingbox_" + game.rnd.integer(), group: 'player_trackingBox', atlas: this.atlas, filename: hitboxes[0], width: 10, height: 10, alpha: 0 });
        targetingBox.sync = function () {
            targetingBox.x = player.x - targetingBox.width / 2;
            targetingBox.y = player.y - game.canvas.height / 2;
        };
        player.defaultTargetingBox = targetingBox;
        player.targetBox = targetingBox;
        var fullPowerAnimation = Phaser.Animation.generateFrameNames("ship_fullpower_", 1, 7).concat(Phaser.Animation.generateFrameNames("ship_fullpower__", 1, 7).reverse());
        var fullpower = this.phaserSprites.addFromAtlas({ name: 'ship_fullpower_addon', atlas: this.atlas, filename: fullPowerAnimation[0], visible: false });
        fullpower.anchor.setTo(0.5, 0.5);
        fullpower.animations.add('fullpower', fullPowerAnimation, 1, true);
        fullpower.animations.play('fullpower', 45, true);
        player.addChild(fullpower);
        player.clearAllEnemyBullets = function (duration) {
            player.clearEnemyBulletsInterval = game.time.returnTrueTime() + duration;
        };
        player.assignTarget = function (enemy) {
            player.targetBox = enemy;
        };
        player.removeTarget = function () {
            player.isForceMoved = true;
            player.game.add.tween(player).to({ angle: 0 }, 500, Phaser.Easing.Linear.Out, true, 100, 0, false).
                onComplete.add(function () {
                player.targetBox = targetingBox;
                player.isForceMoved = false;
            });
        };
        player.getDistanceFromTargetingBox = function () {
            return Math.round(Phaser.Math.distance(player.x, player.y, player.defaultTargetingBox.x, player.defaultTargetingBox.y));
        };
        player.onUpdate = function () {
            fullpower.visible = gameData.player.powerup >= 30 ? true : false;
            if (!!player.targetBox && !player.isForceMoved) {
                player.angle = Math.ceil((360 / (2 * Math.PI)) * game.math.angleBetween(player.x, player.y, player.targetBox.x, player.targetBox.y) + 90);
            }
            if (!player.isForceMoved) {
                player.alpha = (player.isInvincible && !player.isDead) ? 0.5 : 1;
            }
            targetingBox.sync();
            if (!player.isDead) {
                if (player.xCapture.length > 0) {
                    player.x += player.xCapture[0];
                    player.xCapture.shift();
                }
                if (player.yCapture.length > 0) {
                    player.y += player.yCapture[0];
                    player.yCapture.shift();
                }
                if (!player.ignoreBoundaries) {
                    player.checkLimits();
                }
            }
            var collidables = [];
            var weaponSystems = player.weaponSystems.concat(player.subweaponSystems);
            weaponSystems.map(function (weaponSystem) {
                weaponSystem.angle = player.angle;
                weaponSystem.onUpdate();
                weaponSystem.sync(player);
                collidables.push(weaponSystem.ammo.bullets);
            });
            _this.bulletCollisionDetection();
            player.attachments.map(function (attachments) {
                attachments.sync(player);
            });
            onUpdate(player);
        };
        player.restoreHealth = function (val) {
            var gameData = _this.phaserMaster.getOnly(['gameData']).gameData;
            var health = gameData.player.health + val;
            if (health > 100) {
                health = 100;
            }
            updateHealth(health);
        };
        player.takeDamage = function (val) {
            onDamage(player);
            var gameData = _this.phaserMaster.getOnly(['gameData']).gameData;
            var health = gameData.player.health - val;
            updateHealth(health);
            if (health > 0) {
                player.animations.play('shipDamage', 45, false);
                player.isDamaged = true;
                game.time.events.add(250, function () {
                    player.isDamaged = false;
                }, _this).autoDestroy = true;
                player.tint = 1 * 0xff0000;
                player.alpha = 0.75;
                player.game.add.tween(player).to({ tint: 1 * 0xffffff, alpha: 1 }, 10, Phaser.Easing.Linear.Out, true, 100, 0, false).
                    onComplete.add(function () {
                    game.time.events.add(500, function () {
                        player.isInvincible = false;
                    }, _this).autoDestroy = true;
                });
            }
            else {
                player.isDestroyed();
                game.time.events.add(500, function () {
                    loseLife(player);
                }).autoDestroy = true;
            }
        };
        player.isDestroyed = function (respawn) {
            if (respawn === void 0) { respawn = true; }
            if (!player.isDead) {
                player.isDead = true;
                player.isInvincible = true;
                player.destroyWeaponSystems();
                player.onUpdate();
                player.explodeInterval = game.time.events.loop(250, function () {
                    _this.effectsManager.createExplosion(player.x + game.rnd.integerInRange(-player.width / 2, player.width / 2), player.y + game.rnd.integerInRange(-player.height / 2, player.height / 2), 1, player.onLayer + 1);
                });
                _this.effectsManager.createExplosion(player.x, player.y, 1, 6);
                game.add.tween(_this).to({ angle: game.rnd.integerInRange(-90, 90), alpha: 0 }, 1000, Phaser.Easing.Linear.In, true, 0).
                    onComplete.add(function () {
                    _this.weaponManager.createExplosionVacuum(player.x, player.y, 1.5, player.onLayer + 1, 10);
                    var debris = _this.effectsManager.debris(100);
                    debris = debris;
                    debris.customFire(player);
                    game.time.events.remove(player.explodeInterval);
                    player.visible = false;
                });
            }
        };
        player.destroyWeaponSystems = function () {
            player.weaponSystems.map(function (weaponSystem) {
                weaponSystem.destroyIt();
                weaponSystem.ammo.destroy();
            });
            player.weaponSystems = [];
        };
        player.attachPerk = function (type) {
            _this.attachPerk(player, params, type);
        };
        player.attachWeapon = function (weaponType) {
            var weaponSystems;
            switch (weaponType) {
                case 'BULLET':
                    weaponSystems = _this.attachBullet(player, params, weaponType);
                    break;
                case 'SPREAD':
                    weaponSystems = _this.attachSpread(player, params, weaponType);
                    break;
                case 'LASER':
                    weaponSystems = _this.attachLaser(player, params, weaponType);
                    break;
                case 'MISSLE':
                    weaponSystems = _this.attachMissle(player, params, weaponType);
                    break;
                case 'SHOTGUN':
                    weaponSystems = _this.attachShotgun(player, params, weaponType);
                    break;
                case 'GATLING':
                    weaponSystems = _this.attachGatling(player, params, weaponType);
                    break;
            }
            player.collidables.primaryWeapon = [];
            weaponSystems.map(function (weaponSystem) {
                player.collidables.primaryWeapon.push(weaponSystem.ammo.bullets);
            });
        };
        player.attachSubweapon = function (weaponType) {
            var weaponSystems;
            switch (weaponType) {
                case 'CLUSTERBOMB':
                    weaponSystems = _this.attachClusterbomb(player, params, weaponType);
                    break;
            }
            player.collidables.secondaryWeapon = [];
            weaponSystems.map(function (weaponSystem) {
                player.collidables.secondaryWeapon.push(weaponSystem.ammo.bullets);
                if (!!weaponSystem.ammo.bomblets) {
                    weaponSystem.ammo.bomblets.map(function (bomblet) {
                        player.collidables.secondaryWeapon.push(bomblet.bullets);
                    });
                }
            });
        };
        player.fireWeapon = function () {
            player.weaponSystems.map(function (obj) {
                obj.fire();
            });
        };
        player.fireSubweapon = function () {
            player.subweaponSystems.map(function (obj) {
                obj.fire();
            });
        };
        player.regenerateHealth = function (active) {
            if (active === void 0) { active = false; }
        };
        player.moveX = function (val) {
            player.xCapture[0] = val;
        };
        player.moveY = function (val) {
            player.yCapture[0] = val;
        };
        player.checkLimits = function () {
            if (this.y - this.height < 0) {
                this.y = this.height;
            }
            if (this.y + this.height > this.game.world.height) {
                this.y = this.game.world.height - this.height;
            }
            if (this.x < 0) {
                this.x = 0;
            }
            if (this.x > (this.game.world.width + this.width)) {
                this.x = (this.game.world.width + this.width);
            }
        };
        player.moveTo = function (x, y, duration, callback) {
            if (callback === void 0) { callback = function () { }; }
            player.isInvincible = true;
            player.isForceMoved = true;
            _this.phaserControls.disableAllInput();
            game.add.tween(player).to({ x: x, y: y }, duration, Phaser.Easing.Exponential.InOut, true, 0, 0, false).
                onComplete.add(function () {
                player.isInvincible = false;
                player.isForceMoved = false;
                _this.phaserControls.enableAllInput();
                callback();
            });
        };
        player.moveToStart = function (callback) {
            if (callback === void 0) { callback = function () { }; }
            player.isDead = false;
            player.isInvincible = true;
            player.ignoreBoundaries = true;
            player.x = _this.game.world.centerX;
            player.y = _this.game.world.height * 2;
            game.time.events.add(150, function () {
                player.alpha = 1;
                player.visible = true;
                game.add.tween(player).to({ y: game.world.centerY + 100 }, 1000, Phaser.Easing.Exponential.InOut, true, 0, 0, false).
                    onComplete.add(function () {
                    player.ignoreBoundaries = false;
                    _this.phaserControls.enableAllInput();
                    player.attachWeapon(player.primaryWeapon);
                    player.attachSubweapon(player.secondaryWeapon);
                    player.animations.play('shipStart', 12, false);
                    game.time.events.add(1000, function () {
                        player.isInvincible = false;
                        callback();
                    }).autoDestroy = true;
                });
            }).autoDestroy = true;
        };
        player.playEndSequence = function (callback) {
            player.isInvincible = true;
            player.game.add.tween(player.scale).to({ x: 2, y: 2 }, 750, Phaser.Easing.Exponential.InOut, true, 0, 0, false);
            player.game.add.tween(player).to({ x: game.world.centerX, y: game.world.centerY + 50 }, 750, Phaser.Easing.Exponential.InOut, true, 0, 0, false).
                onComplete.add(function () {
                player.game.add.tween(player).to({ y: game.world.height + 200 }, 750, Phaser.Easing.Exponential.InOut, true, 100, 0, false).
                    onComplete.add(function () {
                    player.game.add.tween(player).to({ y: -200 }, 1000, Phaser.Easing.Exponential.InOut, true, 0, 0, false).
                        onComplete.add(function () {
                        callback();
                    }, player);
                }, player);
            }, player);
        };
        this.player = player;
        return player;
    };
    PLAYER_MANAGER.prototype.attachPerk = function (player, params, type) {
        var _this = this;
        var animationSprites;
        var framerate;
        var onLayer;
        switch (type) {
            case 'FIREPOWER':
                animationSprites = Phaser.Animation.generateFrameNames('firepower_', 1, 8).concat(Phaser.Animation.generateFrameNames('firepower_', 1, 8).reverse());
                framerate = 30;
                break;
            case 'ARMORPLATING':
                animationSprites = ['armor_plating'];
                framerate = 30;
                break;
            case 'REGEN':
                animationSprites = Phaser.Animation.generateFrameNames('shield_layer_', 1, 8).slice();
                framerate = 30;
                break;
        }
        if (this.phaserSprites.get(params.name + "_ship_perk") !== undefined) {
            this.phaserSprites.destroy(params.name + "_ship_perk");
        }
        var shipPerk;
        if (type === 'REGEN') {
            shipPerk = this.phaserSprites.addFromAtlas({ name: params.name + "_ship_perk", atlas: this.atlas, filename: animationSprites[0], alpha: 0.5 });
            shipPerk.anchor.setTo(0.5, 0.5);
            shipPerk.scale.set(1.25, 1.25);
            shipPerk.tweenFadeIn = function () {
                _this.game.add.tween(shipPerk).to({ alpha: 0.8 }, 1000, Phaser.Easing.Linear.In, true, 8000).onComplete.add(function () {
                    player.regenerateHealth(true);
                    shipPerk.tweenFadeOut();
                });
            };
            shipPerk.tweenFadeOut = function () {
                _this.game.add.tween(shipPerk).to({ alpha: 0.0 }, 1000, Phaser.Easing.Linear.In, true, 1000).onComplete.add(function () {
                    player.regenerateHealth(false);
                    shipPerk.tweenFadeIn();
                });
            };
            this.game.time.events.add(1000, function () {
                if (shipPerk !== undefined) {
                    shipPerk.tweenFadeOut();
                }
            }).autoDestroy = true;
            shipPerk.animations.add('animate', animationSprites, 1, true);
            shipPerk.animations.play('animate', framerate, true);
            player.addChild(shipPerk);
        }
        else {
            shipPerk = this.phaserSprites.addFromAtlas({ name: params.name + "_ship_perk", atlas: this.atlas, filename: animationSprites[0], visible: true });
            shipPerk.anchor.setTo(0.5, 0.5);
            shipPerk.animations.add('animate', animationSprites, 1, true);
            shipPerk.animations.play('animate', framerate, true);
            player.addChild(shipPerk);
        }
    };
    PLAYER_MANAGER.prototype.attachLaser = function (player, params, weaponType) {
        var _this = this;
        var animationSprites = Phaser.Animation.generateFrameNames('laser_fire_', 1, 1).slice();
        var gap = 15;
        var turrets = 7;
        var _loop_11 = function (i) {
            var weaponSystem = this_8.phaserSprites.addFromAtlas({ name: "ship_weapon_" + this_8.game.rnd.integer(), atlas: this_8.weaponAtlas, filename: animationSprites[0], alpha: 0 });
            weaponSystem.anchor.setTo(0.5, 0.5);
            if (animationSprites.length > 0) {
                weaponSystem.animations.add('fireWeapon', animationSprites, 1, true);
            }
            weaponSystem.offset = (gap * i) - ((gap / 2) * (turrets - 1));
            weaponSystem.index = i;
            weaponSystem.onUpdate = function () { };
            weaponSystem.sync = function (player) {
                var x = player.x, y = player.y, angle = player.angle;
                var coords = _this.weaponManager.calculateRotateCoords(weaponSystem.offset, player.targetBox);
                weaponSystem.x = x + coords.x;
                weaponSystem.y = y + coords.y;
            };
            weaponSystem.destroyIt = function () {
                _this.phaserSprites.destroy(weaponSystem.name);
            };
            weaponSystem.fire = function () {
                var gameData = _this.phaserMaster.getOnly(['gameData']).gameData;
                var powerupLvl = Math.floor((gameData.player.powerup - 1) / 5);
                if (animationSprites.length > 0) {
                    weaponSystem.animations.play('fireWeapon', 60, false);
                }
                ammo.fireAngle = 270 + weaponSystem.angle;
                if (powerupLvl === 0 && (weaponSystem.index === 3)) {
                    ammo.fireOffset(0, 0);
                }
                if (powerupLvl === 1 && (weaponSystem.index === 2 || weaponSystem.index === 4)) {
                    ammo.fireOffset(0, 0);
                }
                if (powerupLvl === 2 && (weaponSystem.index === 2 || weaponSystem.index === 3 || weaponSystem.index === 4)) {
                    ammo.fireOffset(0, 0);
                }
                if (powerupLvl === 3 && (weaponSystem.index === 1 || weaponSystem.index === 2 || weaponSystem.index === 4 || weaponSystem.index === 5)) {
                    ammo.fireOffset(0, 0);
                }
                if (powerupLvl === 4 && (weaponSystem.index === 1 || weaponSystem.index === 2 || weaponSystem.index === 3 || weaponSystem.index === 4 || weaponSystem.index === 5)) {
                    ammo.fireOffset(0, 0);
                }
                if (powerupLvl === 5) {
                    ammo.fireOffset(0, 0);
                }
            };
            this_8.phaserGroup.add(this_8.phaserMaster.get('layers').PLAYER_OVER, weaponSystem);
            var maxBulletsOnscreen = 3;
            var ammo = this_8.weaponManager.playerBullets(maxBulletsOnscreen, weaponType);
            ammo.checkOrientation(weaponSystem.angle);
            ammo.onUpdate = function () { };
            ammo.trackSprite(weaponSystem, 0, 0);
            ammo.weaponSystem = weaponSystem;
            weaponSystem.ammo = ammo;
            player.weaponSystems.push(weaponSystem);
        };
        var this_8 = this;
        for (var i = 0; i < turrets; i++) {
            _loop_11(i);
        }
        return player.weaponSystems;
    };
    PLAYER_MANAGER.prototype.attachShotgun = function (player, params, weaponType) {
        var _this = this;
        var animationSprites = Phaser.Animation.generateFrameNames('bullet_fire_', 1, 4).slice();
        var gap = 20;
        var turrets = 1;
        var _loop_12 = function (i) {
            var weaponSystem = this_9.phaserSprites.addFromAtlas({ name: "ship_weapon_" + this_9.game.rnd.integer(), atlas: this_9.weaponAtlas, filename: animationSprites[0], alpha: 0 });
            weaponSystem.anchor.setTo(0.5, 0.5);
            if (animationSprites.length > 0) {
                weaponSystem.animations.add('fireWeapon', animationSprites, 1, true);
            }
            weaponSystem.offset = (gap * i) - ((gap / 2) * (turrets - 1));
            weaponSystem.index = i;
            weaponSystem.onUpdate = function () {
                ammo.onUpdate();
            };
            weaponSystem.sync = function (player) {
                var x = player.x, y = player.y;
                var coords = _this.weaponManager.calculateRotateCoords(weaponSystem.offset, player.targetBox);
                weaponSystem.x = x + coords.x;
                weaponSystem.y = y + coords.y;
            };
            weaponSystem.destroyIt = function () {
                _this.phaserSprites.destroy(weaponSystem.name);
            };
            weaponSystem.fire = function () {
                var gameData = _this.phaserMaster.getOnly(['gameData']).gameData;
                var powerupLvl = Math.floor((gameData.player.powerup - 1) / 5);
                for (var n = 0; n < 5 * (powerupLvl + 1); n++) {
                    ammo.fireAngle = 270 + weaponSystem.angle;
                    ammo.fire(weaponSystem, null, weaponSystem + 1);
                }
                if (animationSprites.length > 0) {
                    weaponSystem.animations.play('fireWeapon', 60, false);
                }
            };
            this_9.phaserGroup.add(this_9.phaserMaster.get('layers').PLAYER_OVER, weaponSystem);
            var maxBulletsOnscreen = 60;
            var ammo = this_9.weaponManager.playerBullets(maxBulletsOnscreen, weaponType);
            ammo.checkOrientation(weaponSystem.angle);
            ammo.onUpdate = function () {
            };
            ammo.trackSprite(weaponSystem, 0, 0);
            weaponSystem.ammo = ammo;
            player.weaponSystems.push(weaponSystem);
        };
        var this_9 = this;
        for (var i = 0; i < turrets; i++) {
            _loop_12(i);
        }
        return player.weaponSystems;
    };
    PLAYER_MANAGER.prototype.attachBullet = function (player, params, weaponType) {
        var _this = this;
        var animationSprites = Phaser.Animation.generateFrameNames('bullet_fire_', 1, 4).slice();
        var gap = 15;
        var turrets = 12;
        var _loop_13 = function (i) {
            var weaponSystem = this_10.phaserSprites.addFromAtlas({ name: "ship_weapon_" + this_10.game.rnd.integer(), atlas: this_10.weaponAtlas, filename: animationSprites[0], alpha: 0 });
            weaponSystem.anchor.setTo(0.5, 0.5);
            if (animationSprites.length > 0) {
                weaponSystem.animations.add('fireWeapon', animationSprites, 1, true);
            }
            weaponSystem.offset = (gap * i) - ((gap / 2) * (turrets - 1));
            weaponSystem.index = i;
            weaponSystem.onUpdate = function () { };
            weaponSystem.sync = function (player) {
                var x = player.x, y = player.y;
                var coords = _this.weaponManager.calculateRotateCoords(weaponSystem.offset, player.targetBox);
                weaponSystem.x = x + coords.x;
                weaponSystem.y = y + coords.y;
            };
            weaponSystem.destroyIt = function () {
                var x = weaponSystem.x, y = weaponSystem.y;
                _this.effectsManager.blueImpact(x, y, 1, player.onLayer);
                _this.phaserSprites.destroy(weaponSystem.name);
            };
            weaponSystem.fire = function () {
                var gameData = _this.phaserMaster.getOnly(['gameData']).gameData;
                var powerupLvl = Math.floor((gameData.player.powerup - 1) / 5);
                var coords = _this.weaponManager.calculateRotateCoords(30, player.targetBox);
                ammo.fireAngle = 270 + weaponSystem.angle;
                if (powerupLvl >= 0 && (weaponSystem.index === 5 || weaponSystem.index === 6)) {
                    ammo.fireOffset(0, 0);
                }
                if (powerupLvl >= 1 && (weaponSystem.index === 4 || weaponSystem.index === 7)) {
                    ammo.fireOffset(0, 0);
                }
                if (powerupLvl >= 2 && (weaponSystem.index === 3 || weaponSystem.index === 8)) {
                    ammo.fireOffset(0, 0);
                }
                if (powerupLvl >= 3 && (weaponSystem.index === 2 || weaponSystem.index === 9)) {
                    ammo.fireOffset(0, 0);
                }
                if (powerupLvl >= 4 && (weaponSystem.index === 1 || weaponSystem.index === 10)) {
                    ammo.fireOffset(0, 0);
                }
                if (powerupLvl >= 5 && (weaponSystem.index === 0 || weaponSystem.index === 11)) {
                    ammo.fireOffset(0, 0);
                }
            };
            this_10.phaserGroup.add(this_10.phaserMaster.get('layers').PLAYER_OVER, weaponSystem);
            var maxBulletsOnscreen = 3;
            var ammo = this_10.weaponManager.playerBullets(maxBulletsOnscreen, weaponType);
            ammo.checkOrientation(weaponSystem.angle);
            ammo.onUpdate = function () { };
            ammo.trackSprite(weaponSystem);
            weaponSystem.ammo = ammo;
            player.weaponSystems.push(weaponSystem);
        };
        var this_10 = this;
        for (var i = 0; i < turrets; i++) {
            _loop_13(i);
        }
        return player.weaponSystems;
    };
    PLAYER_MANAGER.prototype.attachSpread = function (player, params, weaponType) {
        var _this = this;
        var animationSprites = Phaser.Animation.generateFrameNames('bullet_fire_', 1, 4).slice();
        var gameData = this.phaserMaster.getOnly(['gameData']).gameData;
        var powerupLvl = Math.floor((gameData.player.powerup - 1) / 5);
        var turrets = powerupLvl === 5 ? 2 : 1;
        var gap = 20;
        var _loop_14 = function (i) {
            var weaponSystem = this_11.phaserSprites.addFromAtlas({ name: "ship_weapon_" + this_11.game.rnd.integer(), atlas: this_11.weaponAtlas, filename: animationSprites[0], alpha: 0 });
            weaponSystem.anchor.setTo(0.5, 0.5);
            if (animationSprites.length > 0) {
                weaponSystem.animations.add('fireWeapon', animationSprites, 1, true);
            }
            weaponSystem.offset = (gap * i) - ((gap / 2) * (turrets - 1));
            weaponSystem.onUpdate = function () {
                ammo.onUpdate();
            };
            weaponSystem.sync = function (player) {
                var x = player.x, y = player.y, angle = player.angle;
                weaponSystem.x = x + weaponSystem.offset;
                weaponSystem.y = y;
                weaponSystem.angle = angle;
            };
            weaponSystem.destroyIt = function () {
                var x = weaponSystem.x, y = weaponSystem.y;
                _this.effectsManager.blueImpact(x, y, 1, player.onLayer);
                _this.phaserSprites.destroy(weaponSystem.name);
            };
            weaponSystem.fire = function () {
                var gameData = _this.phaserMaster.getOnly(['gameData']).gameData;
                var powerupLvl = Math.floor((gameData.player.powerup - 1) / 5);
                var coords;
                if (animationSprites.length > 0) {
                    weaponSystem.animations.play('fireWeapon', 60, false);
                }
                var spreadFactor = Math.abs(player.getDistanceFromTargetingBox() / Math.round(Phaser.Math.distance(player.x, player.y, player.targetBox.x, player.targetBox.y)));
                if (powerupLvl >= 0) {
                    ammo.fire(weaponSystem, player.targetBox.x, player.targetBox.y - 1);
                }
                if (powerupLvl >= 1) {
                    coords = _this.weaponManager.calculateSpread(50, player.targetBox);
                    ammo.fire(weaponSystem, coords.x1, coords.y1);
                    ammo.fire(weaponSystem, coords.x2, coords.y2);
                }
                if (powerupLvl >= 2) {
                    coords = _this.weaponManager.calculateSpread(100 / spreadFactor, player.targetBox);
                    ammo.fire(weaponSystem, coords.x1, coords.y1);
                    ammo.fire(weaponSystem, coords.x2, coords.y2);
                }
                if (powerupLvl >= 3) {
                    coords = _this.weaponManager.calculateSpread(150 / spreadFactor, player.targetBox);
                    ammo.fire(weaponSystem, coords.x1, coords.y1);
                    ammo.fire(weaponSystem, coords.x2, coords.y2);
                }
                if (powerupLvl >= 4) {
                    coords = _this.weaponManager.calculateSpread(200 / spreadFactor, player.targetBox);
                    ammo.fire(weaponSystem, coords.x1, coords.y1);
                    ammo.fire(weaponSystem, coords.x2, coords.y2);
                }
                if (powerupLvl >= 5) {
                    coords = _this.weaponManager.calculateSpread(250 / spreadFactor, player.targetBox);
                    ammo.fire(weaponSystem, coords.x1, coords.y1);
                    ammo.fire(weaponSystem, coords.x2, coords.y2);
                }
            };
            this_11.phaserGroup.add(this_11.phaserMaster.get('layers').PLAYER_OVER, weaponSystem);
            var maxBulletsOnscreen = ((powerupLvl + 2) * 12);
            var ammo = this_11.weaponManager.playerBullets(maxBulletsOnscreen, weaponType);
            ammo.checkOrientation(weaponSystem.angle);
            ammo.onUpdate = function () { };
            weaponSystem.ammo = ammo;
            player.weaponSystems.push(weaponSystem);
        };
        var this_11 = this;
        for (var i = 0; i < turrets; i++) {
            _loop_14(i);
        }
        return player.weaponSystems;
    };
    PLAYER_MANAGER.prototype.attachMissle = function (player, params, weaponType) {
        var _this = this;
        var animationSprites = Phaser.Animation.generateFrameNames('missle_fire_', 1, 4).slice();
        var gameData = this.phaserMaster.getOnly(['gameData']).gameData;
        var powerupLvl = Math.floor((gameData.player.powerup - 1) / 5);
        var turrets = powerupLvl === 5 ? 2 : 1;
        var gap = 20;
        var _loop_15 = function (i) {
            var weaponSystem = this_12.phaserSprites.addFromAtlas({ name: "ship_weapon_" + this_12.game.rnd.integer(), atlas: this_12.weaponAtlas, filename: animationSprites[0], alpha: 0 });
            weaponSystem.anchor.setTo(0.5, 0.5);
            if (animationSprites.length > 0) {
                weaponSystem.animations.add('fireWeapon', animationSprites, 1, true);
            }
            weaponSystem.offset = (gap * i) - ((gap / 2) * (turrets - 1));
            weaponSystem.onUpdate = function () { };
            weaponSystem.sync = function (player) {
                var x = player.x, y = player.y;
                var coords = _this.weaponManager.calculateRotateCoords(weaponSystem.offset, player.targetBox);
                weaponSystem.x = x + coords.x;
                weaponSystem.y = y + coords.y;
            };
            weaponSystem.destroyIt = function () {
                var x = weaponSystem.x, y = weaponSystem.y;
            };
            weaponSystem.fire = function () {
                var gameData = _this.phaserMaster.getOnly(['gameData']).gameData;
                var powerupLvl = Math.floor((gameData.player.powerup - 1) / 5);
                if (animationSprites.length > 0) {
                    weaponSystem.animations.play('fireWeapon', 60, false);
                }
                ammo.fireAngle = 270 + weaponSystem.angle;
                ammo.fire(weaponSystem);
                if (powerupLvl === 0) {
                    ammo.fire(weaponSystem);
                    ammo.fire(weaponSystem);
                }
                if (powerupLvl >= 1) {
                    ammo.fire(weaponSystem);
                    ammo.fire(weaponSystem);
                }
                if (powerupLvl >= 3) {
                    ammo.fire(weaponSystem);
                    ammo.fire(weaponSystem);
                }
                if (powerupLvl >= 4) {
                    ammo.fire(weaponSystem);
                    ammo.fire(weaponSystem);
                }
                if (powerupLvl >= 5) {
                    ammo.fire(weaponSystem);
                    ammo.fire(weaponSystem);
                }
            };
            this_12.phaserGroup.add(this_12.phaserMaster.get('layers').PLAYER_OVER, weaponSystem);
            var maxBulletsOnscreen = ((powerupLvl + 2) * 8);
            var ammo = this_12.weaponManager.playerBullets(maxBulletsOnscreen, weaponType);
            ammo.checkOrientation(weaponSystem.angle);
            ammo.onUpdate = function () { };
            weaponSystem.ammo = ammo;
            player.weaponSystems.push(weaponSystem);
        };
        var this_12 = this;
        for (var i = 0; i < turrets; i++) {
            _loop_15(i);
        }
        return player.weaponSystems;
    };
    PLAYER_MANAGER.prototype.attachGatling = function (player, params, weaponType) {
        var _this = this;
        var animationSprites = Phaser.Animation.generateFrameNames('missle_fire_', 1, 4).slice();
        var gameData = this.phaserMaster.getOnly(['gameData']).gameData;
        var powerupLvl = Math.floor((gameData.player.powerup - 1) / 5);
        var turrets = 1;
        var gap = 20;
        var _loop_16 = function (i) {
            var weaponSystem = this_13.phaserSprites.addFromAtlas({ name: "ship_weapon_" + this_13.game.rnd.integer(), atlas: this_13.weaponAtlas, filename: animationSprites[0], visible: true });
            weaponSystem.anchor.setTo(0.5, 0.5);
            if (animationSprites.length > 0) {
                weaponSystem.animations.add('fireWeapon', animationSprites, 1, true);
            }
            weaponSystem.offset = (gap * i) - ((gap / 2) * (turrets - 1));
            weaponSystem.onUpdate = function () { };
            weaponSystem.sync = function (player) {
                var x = player.x, y = player.y;
                var coords = _this.weaponManager.calculateRotateCoords(weaponSystem.offset, player.targetBox);
                weaponSystem.x = x + coords.x;
                weaponSystem.y = y + coords.y;
            };
            weaponSystem.destroyIt = function () {
                _this.phaserSprites.destroy(weaponSystem.name);
            };
            weaponSystem.fire = function () {
                var gameData = _this.phaserMaster.getOnly(['gameData']).gameData;
                var powerupLvl = Math.floor((gameData.player.powerup - 1) / 5);
                if (animationSprites.length > 0) {
                    weaponSystem.animations.play('fireWeapon', 60, false);
                }
                ammo.fireAngle = 270 + weaponSystem.angle;
                if (powerupLvl == 0) {
                    ammo.fire(weaponSystem);
                }
                if (powerupLvl >= 1) {
                    _this.game.time.events.add(50, function () {
                        ammo.fire(weaponSystem);
                    }).autoDestroy = true;
                }
                if (powerupLvl >= 2) {
                    _this.game.time.events.add(100, function () {
                        ammo.fire(weaponSystem);
                    }).autoDestroy = true;
                }
                if (powerupLvl >= 3) {
                    _this.game.time.events.add(150, function () {
                        ammo.fire(weaponSystem);
                    }).autoDestroy = true;
                }
                if (powerupLvl >= 4) {
                    _this.game.time.events.add(200, function () {
                        ammo.fire(weaponSystem);
                    }).autoDestroy = true;
                }
                if (powerupLvl >= 5) {
                    _this.game.time.events.add(50, function () {
                        ammo.fire(weaponSystem);
                    }).autoDestroy = true;
                }
            };
            this_13.phaserGroup.add(this_13.phaserMaster.get('layers').PLAYER_OVER, weaponSystem);
            var maxBulletsOnscreen = 12;
            var ammo = this_13.weaponManager.playerBullets(maxBulletsOnscreen, weaponType);
            ammo.checkOrientation(weaponSystem.angle);
            ammo.onUpdate = function () { };
            weaponSystem.ammo = ammo;
            player.weaponSystems.push(weaponSystem);
        };
        var this_13 = this;
        for (var i = 0; i < turrets; i++) {
            _loop_16(i);
        }
        return player.weaponSystems;
    };
    PLAYER_MANAGER.prototype.attachClusterbomb = function (player, params, weaponType) {
        var animationSprites = Phaser.Animation.generateFrameNames('laser_fire_', 1, 6).slice();
        var gap = 35;
        var turrets = 5;
        var weaponSystem = this.phaserSprites.addFromAtlas({ name: "ship_weapon_" + this.game.rnd.integer(), atlas: this.weaponAtlas, filename: animationSprites[0], alpha: 0 });
        weaponSystem.anchor.setTo(0.5, 0.5);
        if (animationSprites.length > 0) {
            weaponSystem.animations.add('fireWeapon', animationSprites, 1, true);
        }
        weaponSystem.onUpdate = function () {
            ammo.onUpdate();
        };
        weaponSystem.sync = function (player) {
            var x = player.x, y = player.y;
            weaponSystem.x = x;
            weaponSystem.y = y;
        };
        weaponSystem.destroyIt = function () {
            var x = weaponSystem.x, y = weaponSystem.y;
        };
        weaponSystem.fire = function () {
            ammo.fire(weaponSystem, player.targetBox.x, player.targetBox.y - 1);
        };
        this.phaserGroup.add(this.phaserMaster.get('layers').PLAYER_OVER, weaponSystem);
        var maxBulletsOnscreen = 4;
        var onKill = function () {
            player.clearAllEnemyBullets(Phaser.Timer.SECOND * 2);
        };
        var ammo = this.weaponManager.createClusterbomb(maxBulletsOnscreen, onKill);
        ammo.onUpdate = function () {
        };
        weaponSystem.ammo = ammo;
        player.subweaponSystems.push(weaponSystem);
        return player.subweaponSystems;
    };
    PLAYER_MANAGER.prototype.damgePopup = function (target, amount) {
        var _this = this;
        var x = target.x, y = target.y, width = target.width, height = target.height;
        this.game.time.events.add(this.game.rnd.integerInRange(0, 150), function () {
            var damageAmount = _this.phaserTexts.add({ name: "enemy_" + _this.game.rnd.integer(), group: 'ui', font: 'gem', x: x + _this.game.rnd.integerInRange(-20, 20), y: y + _this.game.rnd.integerInRange(-20, 20), size: 12, default: amount });
            _this.game.add.tween(damageAmount.scale).to({ x: 1.5, y: 1.5 }, 250, Phaser.Easing.Back.In, true, 0, 0, false);
            _this.game.add.tween(damageAmount).to({ y: damageAmount.y + 10 }, 250, Phaser.Easing.Back.In, true, 0, 0, false).
                onComplete.add(function () {
                _this.game.add.tween(damageAmount).to({ y: damageAmount.y - 10, alpha: 0 }, 250, Phaser.Easing.Bounce.Out, true, 0, 0, false).
                    onComplete.add(function () {
                    _this.phaserTexts.destroy(damageAmount.name);
                });
            });
        }, this).autoDestroy = true;
    };
    PLAYER_MANAGER.prototype.bulletCollisionDetection = function () {
        var _this = this;
        var enemies = this.phaserSprites.getGroup('enemy_hitboxes').slice();
        var collidables = this.player.collidables.primaryWeapon.concat(this.player.collidables.secondaryWeapon);
        this.phaserSprites.getManyGroups(['impactExplosions']).map(function (obj) {
            collidables.push(obj);
        });
        this.game.physics.arcade.overlap(enemies, collidables, function (enemy, collidable) {
            var e = enemy.parent;
            if (!e.isDestroyed) {
                var weaponData = collidable.weaponData;
                if ((!e.isDamaged && !e.isDestroyed) || (weaponData.ignoreDamageState && !e.isDestroyed)) {
                    if (weaponData.reference === 'LASER') {
                        var coords = _this.weaponManager.calculateRotateCoords(0, _this.player.targetBox);
                        _this.effectsManager.electricDischarge(e.x + _this.game.rnd.integerInRange(-10, 10), e.y + _this.game.rnd.integerInRange(-10, 10), 1, e.onLayer + 1);
                    }
                    if (weaponData.reference === 'SPREAD') {
                        _this.effectsManager.blueImpact(collidable.x, collidable.y, 1, e.onLayer + 1);
                    }
                    if (weaponData.reference === 'SHOTGUN') {
                        _this.effectsManager.pelletImpact(collidable.x, collidable.y, 1, e.onLayer + 1);
                    }
                    if (weaponData.reference === 'GATLING') {
                        _this.effectsManager.pelletImpact(collidable.x, collidable.y, 1, e.onLayer + 1);
                    }
                    if (weaponData.reference === 'BULLET') {
                        _this.effectsManager.orangeImpact(collidable.x, collidable.y, 1, e.onLayer + 1);
                    }
                    if (weaponData.reference === 'MISSLE') {
                        _this.weaponManager.createExplosionBasic(collidable.x, collidable.y, 1, e.onLayer + 1, Math.round(weaponData.damage / 2));
                    }
                    _this.damgePopup(e, weaponData.damage);
                    e.damageIt(weaponData.damage);
                }
                if (!weaponData.pierce && !weaponData.completeAnimation) {
                    collidable.destroyIt(e.onLayer - 1);
                }
            }
        });
    };
    PLAYER_MANAGER.prototype.destroyShip = function (name) {
        this.phaserSprites.destroy(name);
        this.phaserSprites.destroy(name + "_exhaust");
        this.phaserSprites.getGroup(name + "_trails").map(function (obj) {
            obj.destroySelf();
        });
    };
    return PLAYER_MANAGER;
}());
var UTILITY_MANAGER = (function () {
    function UTILITY_MANAGER() {
    }
    UTILITY_MANAGER.prototype.assign = function (game, phaserMaster, phaserSprites, phaserBitmapdata, phaserGroup, atlas) {
        this.game = game;
        this.phaserSprites = phaserSprites;
        this.phaserMaster = phaserMaster;
        this.phaserBitmapdata = phaserBitmapdata;
        this.phaserGroup = phaserGroup;
        this.atlas = atlas;
    };
    UTILITY_MANAGER.prototype.buildOverlayBackground = function (start, end, layer, visibleOnStart) {
        if (visibleOnStart === void 0) { visibleOnStart = false; }
        var game = this.game;
        var overlaybmd = this.phaserBitmapdata.addGradient({ name: 'um_overlay__bmd', start: start, end: end, width: 5, height: 5, render: false });
        var overlay = this.phaserSprites.add({ x: 0, y: 0, name: "um_overlay__bg", width: game.world.width, height: game.world.height, reference: overlaybmd.cacheBitmapData, visible: visibleOnStart });
        overlay.flash = function (speed, callback) {
            if (speed === void 0) { speed = 500; }
            if (callback === void 0) { callback = function () { }; }
            overlay.visible = true;
            overlay.alpha = 1;
            game.time.events.add(250, function () {
                game.add.tween(overlay).to({ alpha: 0 }, speed, Phaser.Easing.Linear.In, true, 0, 0, false).
                    onComplete.add(function () { });
                callback();
            }).autoDestroy = true;
        };
        overlay.fadeIn = function (speed, callback) {
            if (speed === void 0) { speed = 500; }
            if (callback === void 0) { callback = function () { }; }
            overlay.visible = true;
            overlay.alpha = 0;
            game.add.tween(overlay).to({ alpha: 1 }, speed, Phaser.Easing.Linear.In, true, 0, 0, false).
                onComplete.add(function () {
                callback();
            });
        };
        overlay.fadeOut = function (speed, callback) {
            if (speed === void 0) { speed = 500; }
            if (callback === void 0) { callback = function () { }; }
            overlay.visible = true;
            overlay.alpha = 1;
            game.add.tween(overlay).to({ alpha: 0 }, speed, Phaser.Easing.Linear.In, true, 0, 0, false).
                onComplete.add(function () {
                callback();
            });
        };
        this.phaserGroup.add(this.phaserMaster.get('layers').OVERLAY, overlay);
    };
    UTILITY_MANAGER.prototype.buildOverlayGrid = function (squareSizeH, squareSizeV, layer, image) {
        if (squareSizeH === void 0) { squareSizeH = 80; }
        if (squareSizeV === void 0) { squareSizeV = 80; }
        var game = this.game;
        var count = 0;
        for (var c = 0; c < Math.ceil(game.world.height / squareSizeV) + 1; c++) {
            var _loop_17 = function (r) {
                var gridSquare = this_14.phaserSprites.addFromAtlas({ x: r * squareSizeH, y: c * squareSizeV, name: "grid" + count, group: 'um_grid__bg', width: squareSizeH, height: squareSizeV, atlas: this_14.atlas, filename: image, visible: true });
                gridSquare.anchor.setTo(0.5, 0.5);
                gridSquare.scale.setTo(1, 1);
                gridSquare.fadeOut = function (speed) {
                    gridSquare.scale.setTo(1, 1);
                    game.add.tween(gridSquare).to({ height: 0 }, speed, Phaser.Easing.Linear.Out, true, 0, 0, false);
                };
                gridSquare.fadeIn = function (speed) {
                    game.add.tween(gridSquare).to({ height: squareSizeV }, speed, Phaser.Easing.Linear.In, true, 0, 0, false);
                };
                gridSquare.scaleOut = function (speed) {
                    game.add.tween(gridSquare.scale).to({ x: 0, y: 0 }, speed, Phaser.Easing.Linear.In, true, 0, 0, false);
                };
                gridSquare.scaleIn = function (speed) {
                    game.add.tween(gridSquare.scale).to({ x: 1, y: 1 }, speed, Phaser.Easing.Linear.Out, true, 0, 0, false);
                };
                count++;
                this_14.phaserGroup.add(this_14.phaserMaster.get('layers').OVERLAY, gridSquare);
            };
            var this_14 = this;
            for (var r = 0; r < Math.ceil(game.world.width / squareSizeH) + 1; r++) {
                _loop_17(r);
            }
        }
    };
    UTILITY_MANAGER.prototype.overlayBGControls = function (options, callback) {
        var transition = options.transition, delay = options.delay, speed = options.speed;
        var um_overlay__bg = this.phaserSprites.getOnly(['um_overlay__bg']).um_overlay__bg;
        this.game.time.events.add(delay, function () {
            switch (transition) {
                case 'FLASHWHITE':
                    um_overlay__bg.flash(speed, callback);
                    break;
                case 'FADEIN':
                    um_overlay__bg.fadeIn(speed, callback);
                    break;
                case 'FADEOUT':
                    um_overlay__bg.fadeOut(speed, callback);
                    break;
            }
        }).autoDestroy = true;
    };
    UTILITY_MANAGER.prototype.overlayControls = function (options, callback) {
        var game = this.game;
        var transition = options.transition, delay = options.delay, speed = options.speed, tileDelay = options.tileDelay;
        var grid = this.phaserSprites.getGroup('um_grid__bg');
        var odd = [];
        var even = [];
        var rowDelay = (tileDelay * grid.length) * 0.75;
        var returnDelay = rowDelay + (tileDelay * grid.length);
        game.time.events.add(delay, function () {
            switch (transition) {
                case 'WIPEIN':
                    grid.map(function (obj, index) {
                        if (index % 2 === 0) {
                            even.push(obj);
                        }
                        else {
                            odd.push(obj);
                        }
                    });
                    even.map(function (obj, index) {
                        game.time.events.add(tileDelay * index, function () {
                            obj.scaleIn(speed);
                        }).autoDestroy = true;
                    });
                    game.time.events.add(returnDelay, function () {
                        odd.slice(0).reverse().map(function (obj, index) {
                            game.time.events.add(tileDelay * index, function () {
                                obj.scaleIn(speed);
                            }).autoDestroy = true;
                        });
                    }, rowDelay);
                    game.time.events.add(returnDelay, function () {
                        callback();
                    }).autoDestroy = true;
                    break;
                case 'WIPEOUT':
                    grid.map(function (obj, index) {
                        if (index % 2 === 0) {
                            even.push(obj);
                        }
                        else {
                            odd.push(obj);
                        }
                    });
                    even.map(function (obj, index) {
                        game.time.events.add(tileDelay * index, function () {
                            obj.scaleOut(speed);
                        }).autoDestroy = true;
                    });
                    game.time.events.add(returnDelay, function () {
                        odd.slice(0).reverse().map(function (obj, index) {
                            game.time.events.add(tileDelay * index, function () {
                                obj.scaleOut(speed);
                            }).autoDestroy = true;
                        });
                    }, rowDelay);
                    game.time.events.add(returnDelay, function () {
                        callback();
                    }).autoDestroy = true;
                    break;
                case 'FADEOUT':
                    grid.map(function (obj, index) {
                        game.time.events.add(tileDelay * index, function () {
                            obj.fadeOut(speed);
                        }).autoDestroy = true;
                    });
                    game.time.events.add(grid.length * tileDelay + speed, function () {
                        callback();
                    }).autoDestroy = true;
                    break;
                case 'FADEIN':
                    grid.map(function (obj, index) {
                        game.time.events.add(returnDelay, function () {
                            obj.fadeIn(speed);
                        }, tileDelay * index);
                    });
                    game.time.events.add(returnDelay, function () {
                        callback();
                    }, grid.length * tileDelay + speed);
                    break;
            }
        }).autoDestroy = true;
    };
    return UTILITY_MANAGER;
}());
var WEAPON_MANAGER = (function () {
    function WEAPON_MANAGER() {
    }
    WEAPON_MANAGER.prototype.assign = function (game, phaserMaster, phaserSprites, phaserGroup, effectsManager, atlas) {
        this.game = game;
        this.phaserSprites = phaserSprites;
        this.phaserMaster = phaserMaster;
        this.phaserGroup = phaserGroup;
        this.effectsManager = effectsManager;
        this.atlas = atlas;
    };
    WEAPON_MANAGER.prototype.calculateRotateCoords = function (spreadAmount, trackingbox) {
        var angle = trackingbox.angle;
        var anglePercentage = Math.abs(trackingbox.angle);
        if (anglePercentage > 90) {
            anglePercentage = Math.abs(anglePercentage - 180);
        }
        var quadrant;
        if (angle >= 0 && angle < 90) {
            quadrant = 0;
        }
        if (angle >= 90 && angle < 180) {
            quadrant = 1;
        }
        if (angle >= -180 && angle < -90) {
            quadrant = 2;
        }
        if (angle >= -90 && angle < 0) {
            quadrant = 3;
        }
        var spreadX = Math.round(spreadAmount - (spreadAmount * (anglePercentage / 90)));
        var spreadY = Math.round((spreadAmount * (anglePercentage / 90)));
        spreadX = quadrant === 1 ? -spreadX : spreadX;
        spreadY = quadrant === 3 ? -spreadY : spreadY;
        return {
            x: spreadX,
            y: spreadY
        };
    };
    WEAPON_MANAGER.prototype.calculateSpread = function (spreadAmount, trackingbox) {
        var angle = trackingbox.angle;
        var anglePercentage = Math.abs(trackingbox.angle);
        if (anglePercentage > 90) {
            anglePercentage = Math.abs(anglePercentage - 180);
        }
        var quadrant;
        if (angle >= 0 && angle < 90) {
            quadrant = 0;
        }
        if (angle >= 90 && angle < 180) {
            quadrant = 1;
        }
        if (angle >= -180 && angle < -90) {
            quadrant = 2;
        }
        if (angle >= -90 && angle < 0) {
            quadrant = 3;
        }
        var spreadX = Math.round(spreadAmount - (spreadAmount * (anglePercentage / 90)));
        var spreadY = Math.round((spreadAmount * (anglePercentage / 90)));
        spreadX = quadrant === 1 ? -spreadX : spreadX;
        spreadY = quadrant === 3 ? -spreadY : spreadY;
        return {
            x1: trackingbox.x + spreadX,
            y1: trackingbox.y + spreadY,
            x2: trackingbox.x - spreadX,
            y2: trackingbox.y - spreadY
        };
    };
    WEAPON_MANAGER.prototype.enemyBullet = function (bulletPoolTotal) {
        var _this = this;
        if (bulletPoolTotal === void 0) { bulletPoolTotal = 2; }
        var game = this.game;
        var phaserMaster = this.phaserMaster;
        var weapon = game.add.weapon(bulletPoolTotal, this.atlas, 'enemy_bullet');
        weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
        weapon.bulletSpeed = 400;
        weapon.bulletAngleOffset = 90;
        weapon.multiFire = true;
        weapon.checkOrientation = function (angle) {
            weapon.bulletSpeed = -Math.abs(weapon.bulletSpeed);
            weapon.bulletAngleOffset = -Math.abs(weapon.bulletAngleOffset);
        };
        this.phaserGroup.add(this.phaserMaster.get('layers').ENEMY_BULLETS, weapon.bullets);
        weapon.bullets.children.map(function (bullet) {
            bullet.destroyIt = function (layer) {
                bullet.kill();
                _this.effectsManager.orangeImpact(bullet.x + _this.game.rnd.integerInRange(-5, 5), bullet.y + _this.game.rnd.integerInRange(-5, 15), 1, layer);
            };
        });
        return weapon;
    };
    WEAPON_MANAGER.prototype.playerBullets = function (bulletPoolTotal, type) {
        var game = this.game;
        var phaserMaster = this.phaserMaster;
        var weaponData = phaserMaster.getAll(['weaponData']).weaponData;
        var data = weaponData.primaryWeapons[type];
        var weapon = game.add.weapon(bulletPoolTotal, this.atlas, data.spriteAnimation[0]);
        weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
        weapon.bulletSpeed = data.bulletSpeed;
        weapon.bulletAngleOffset = 90;
        weapon.multiFire = true;
        if (data.spriteAnimation.length > 0) {
            weapon.bullets.callAll('animations.add', 'animations', 'fire', data.spriteAnimation, 20, true);
            weapon.bullets.callAll('play', null, 'fire');
        }
        switch (type) {
            case 'MISSLE':
                weapon.bulletSpeedVariance = 300;
                weapon.bulletAngleVariance = 15;
                break;
            case 'SHOTGUN':
                weapon.bulletSpeedVariance = 1000;
                weapon.bulletAngleOffset = -10;
                weapon.bulletAngleVariance = 20;
                break;
            case 'GATLING':
                weapon.bulletSpeedVariance = 300;
                weapon.bulletAngleVariance = 3;
                break;
        }
        weapon.onKill.add(function (bullet) {
        });
        weapon.checkOrientation = function (angle) {
            if (angle < 180) {
                weapon.bulletSpeed = Math.abs(weapon.bulletSpeed);
                weapon.bulletAngleOffset = Math.abs(weapon.bulletAngleOffset);
            }
            else {
                weapon.bulletSpeed = -Math.abs(weapon.bulletSpeed);
                weapon.bulletAngleOffset = -Math.abs(weapon.bulletAngleOffset);
            }
        };
        this.phaserGroup.add(this.phaserMaster.get('layers').PLAYER_BULLETS, weapon.bullets);
        weapon.bullets.children.map(function (bullet) {
            bullet.weaponData = data;
            bullet.pierce = data.pierce;
            bullet.destroyIt = function (layer) {
                bullet.kill();
            };
        });
        return weapon;
    };
    WEAPON_MANAGER.prototype.createClusterbomb = function (bulletPoolTotal, onKill) {
        var _this = this;
        if (onKill === void 0) { onKill = function () { }; }
        var game = this.game;
        var _a = this, phaserMaster = _a.phaserMaster, phaserSprites = _a.phaserSprites, phaserGroup = _a.phaserGroup, atlas = _a.atlas;
        var weaponData = phaserMaster.getAll().weaponData;
        var data = weaponData.secondaryWeapons.CLUSTERBOMB;
        var bombletAmount = 25;
        var bomblets = this.createBomblet(bombletAmount);
        var weapon = game.add.weapon(1, this.atlas, data.spriteAnimation[0]);
        weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
        weapon.bulletSpeed = data.bulletSpeed;
        weapon.bulletAngleOffset = 90;
        weapon.multiFire = true;
        weapon.bulletLifespan = 750;
        weapon.bomblets = bomblets;
        if (data.spriteAnimation.length > 0) {
            weapon.bullets.callAll('animations.add', 'animations', 'fire', data.spriteAnimation, 20, true);
            weapon.bullets.callAll('play', null, 'fire');
        }
        weapon.onKill.add(function (bullet) {
            onKill();
            bomblets.map(function (bomblet) {
                bomblet.fire(bullet);
            });
            _this.createExplosionVacuum(bullet.x, bullet.y, 1.25, 8, data.damage);
        });
        weapon.bullets.children.map(function (bullet) {
            bullet.weaponData = data;
            bullet.pierce = data.pierce;
            bullet.destroyIt = function (layer) {
                bullet.kill();
            };
        });
        this.phaserGroup.add(this.phaserMaster.get('layers').SPECIAL_WEAPON, weapon.bullets);
        return weapon;
    };
    WEAPON_MANAGER.prototype.createBomblet = function (amount) {
        var _this = this;
        var game = this.game;
        var _a = this, phaserMaster = _a.phaserMaster, phaserSprites = _a.phaserSprites, phaserGroup = _a.phaserGroup, atlas = _a.atlas;
        var weaponData = phaserMaster.getAll().weaponData;
        var data = {
            reference: 'BOMBLET',
            spriteAnimation: ["bomblet"],
            damage: 25,
            pierce: false,
            ignoreDamageState: false,
            completeAnimation: false
        };
        var bomblets = [];
        for (var i = 0; i < amount; i++) {
            var bomblet = game.add.weapon(1, this.atlas, data.spriteAnimation[0]);
            bomblet.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
            bomblet.bulletSpeed = 500 + game.rnd.integerInRange(50, 150);
            bomblet.bulletAngleVariance = 140;
            bomblet.bulletLifespan = game.rnd.integerInRange(50, 500);
            if (data.spriteAnimation.length > 0) {
                bomblet.bullets.callAll('animations.add', 'animations', 'fire', data.spriteAnimation, 20, true);
                bomblet.bullets.callAll('play', null, 'fire');
            }
            bomblet.onKill.add(function (bullet) {
                _this.createExplosionBasic(bullet.x, bullet.y, 1.25, _this.phaserMaster.get('layers').SPECIAL_WEAPON, data.damage);
            });
            bomblet.bullets.children.map(function (bullet) {
                bullet.weaponData = data;
                bullet.pierce = data.pierce;
                bullet.destroyIt = function (layer) {
                    bullet.kill();
                };
            });
            this.phaserGroup.add(this.phaserMaster.get('layers').SPECIAL_WEAPON, bomblet.bullets);
            bomblets.push(bomblet);
        }
        return bomblets;
    };
    WEAPON_MANAGER.prototype.createExplosionVacuum = function (x, y, scale, layer, damage, onDestroy, onUpdate) {
        if (onDestroy === void 0) { onDestroy = function () { }; }
        if (onUpdate === void 0) { onUpdate = function () { }; }
        var game = this.game;
        var _a = this, phaserSprites = _a.phaserSprites, phaserGroup = _a.phaserGroup, atlas = _a.atlas;
        var data = {
            reference: 'EXPLOSION_VACUUM',
            spriteAnimation: Phaser.Animation.generateFrameNames('explosion_vacuum_', 1, 9).slice(),
            damage: 25,
            pierce: false,
            ignoreDamageState: false,
            completeAnimation: true
        };
        var explosion = phaserSprites.addFromAtlas({ name: "impact_" + game.rnd.integer(), group: 'impactExplosions', x: x, y: y, atlas: atlas, filename: data.spriteAnimation[0] });
        explosion.scale.setTo(scale, scale);
        explosion.anchor.setTo(0.5, 0.5);
        explosion.weaponData = data;
        explosion.animations.add('explosion', data.spriteAnimation, 1, true);
        explosion.animations.play('explosion', 30, false).onComplete.add(function () {
            explosion.destroyIt();
        }, explosion);
        explosion.destroyIt = function () {
            phaserSprites.destroy(explosion.name);
        };
        game.camera.shake(0.004, 500);
        phaserGroup.add(layer === undefined ? this.phaserMaster.get('layers').VISUALS : layer, explosion);
        game.physics.enable(explosion, Phaser.Physics.ARCADE);
        return explosion;
    };
    WEAPON_MANAGER.prototype.createExplosionVacuumFire = function (x, y, scale, layer, damage, onDestroy, onUpdate) {
        if (onDestroy === void 0) { onDestroy = function () { }; }
        if (onUpdate === void 0) { onUpdate = function () { }; }
        var game = this.game;
        var _a = this, phaserSprites = _a.phaserSprites, phaserGroup = _a.phaserGroup, atlas = _a.atlas;
        var data = {
            reference: 'VACUUMEXPLOSION',
            spriteAnimation: Phaser.Animation.generateFrameNames('explosion_vacuum_inner_', 1, 13).slice(),
            damage: 25,
            pierce: false,
            ignoreDamageState: false,
            completeAnimation: true
        };
        var explosion = phaserSprites.addFromAtlas({ name: "impact_" + game.rnd.integer(), group: 'impactExplosions', x: x, y: y, atlas: atlas, filename: data.spriteAnimation[0] });
        explosion.scale.setTo(scale, scale);
        explosion.anchor.setTo(0.5, 0.5);
        explosion.weaponData = data;
        explosion.animations.add('explosion', data.spriteAnimation, 1, true);
        explosion.animations.play('explosion', 30, false).onComplete.add(function () {
            explosion.destroyIt();
        }, explosion);
        explosion.destroyIt = function () {
            phaserSprites.destroy(explosion.name);
        };
        game.camera.shake(0.004, 500);
        phaserGroup.add(layer === undefined ? this.phaserMaster.get('layers').VISUALS : layer, explosion);
        game.physics.enable(explosion, Phaser.Physics.ARCADE);
        return explosion;
    };
    WEAPON_MANAGER.prototype.createExplosionBasic = function (x, y, scale, layer, damage, onDestroy, onUpdate) {
        if (onDestroy === void 0) { onDestroy = function () { }; }
        if (onUpdate === void 0) { onUpdate = function () { }; }
        var game = this.game;
        console.log(damage);
        var _a = this, phaserSprites = _a.phaserSprites, phaserGroup = _a.phaserGroup, atlas = _a.atlas;
        var data = {
            reference: 'EXPLOSION_BASIC',
            spriteAnimation: Phaser.Animation.generateFrameNames('explosions_Layer_', 1, 16),
            damage: damage !== undefined ? damage : 25,
            pierce: false,
            ignoreDamageState: false,
            completeAnimation: true
        };
        var explosion = phaserSprites.addFromAtlas({ name: "impact_" + game.rnd.integer(), group: 'impactExplosions', x: x, y: y, atlas: atlas, filename: data.spriteAnimation[0] });
        explosion.scale.setTo(scale, scale);
        explosion.anchor.setTo(0.5, 0.5);
        explosion.weaponData = data;
        explosion.animations.add('explosion', data.spriteAnimation, 1, true);
        explosion.animations.play('explosion', 30, false).onComplete.add(function () {
            explosion.destroyIt();
        }, explosion);
        explosion.destroyIt = function () {
            phaserSprites.destroy(explosion.name);
        };
        game.camera.shake(0.002, 500);
        phaserGroup.add(layer === undefined ? this.phaserMaster.get('layers').VISUALS : layer, explosion);
        game.physics.enable(explosion, Phaser.Physics.ARCADE);
        return explosion;
    };
    return WEAPON_MANAGER;
}());

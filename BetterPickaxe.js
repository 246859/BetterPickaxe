const TRIGGER_FLAG = "§4传奇§6锯刃十字镐";
const DIR = "./plugins/BetterPickaxe/";
const CONFIG = DIR + "Config.json";

const DEFAULT_CONFIG = {
    tool:"wooden_pickaxe"
};

let config = {};

mc.listen("onDestroyBlock", function (player, block) {//挖矿加强
    if (player && block) {
        let hand = player.getHand();

        if (hand && isTriggerItem(hand)) {

            let dir = player.direction;
            let pos = block.pos;//坐标对象

            let blx = pos.x;//被破坏方块的坐标
            let bly = pos.y;
            let blz = pos.z;

            let pitch = dir.pitch;//仰俯角 -90 —— 90

            let blx1 = (blx - 1);
            let bly1 = (bly);
            let blz1 = (blz - 1);

            let blx2 = (blx + 1);
            let bly2 = (bly + (pitch <= 60 ? 2 : -2));//计算角度判断是向下还是向上，
            let blz2 = (blz + 1);

            mc.runcmdEx(`execute ${player.name} ~ ~ ~/fill ${blx1.toString()} ${bly1.toString()} ${blz1.toString()} ${blx2.toString()} ${bly2.toString()} ${blz2.toString()} air 0 destroy`);
        }
    }
});

function isTriggerItem(item) {
    let nbt = item.getNbt();
    let tagNbt = nbt.getData("tag");
    if (!tagNbt) return;
    let displayNbt = tagNbt.getData("display");
    if (!displayNbt) return;
    let loreNbt = displayNbt.getData("Lore");
    if (!loreNbt) return;
    return loreNbt.getTag(0).toString() === TRIGGER_FLAG;
}

function getTriggerItem() {
    let item = mc.newItem(config.tool, 1);
    item.setLore([TRIGGER_FLAG]);
    return item;
}

function cmdCallBack(cmd,origin,output,results){
    let pl = origin.player;
    pl.giveItem(getTriggerItem());
}

function regCommand(){
    let cmd = mc.newCommand("btm","获取加强稿");
    cmd.overload([]);
    cmd.setCallback(cmdCallBack);
    cmd.setup();
}

function initFile(){
    if (!File.exists(DIR))
        File.mkdir(DIR);
    if (!File.exists(CONFIG))
        File.writeTo(CONFIG,JSON.stringify(DEFAULT_CONFIG));
}

function initData(){
    let configBuffer = JSON.parse(File.readFrom(CONFIG));

    if (configBuffer)
        config = configBuffer;
}

function ini(){
    regCommand();
    initFile();
    initData();
}

ini();

logger.info("Author:stranger");
logger.info("Version:v1.0.1");
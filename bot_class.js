const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const GoalFollow = goals.GoalFollow

const help_message_array = [
    `&3Hola! Estos son mis comandos`,
    `&b\'ayuda\' &3te escribo estos mensajes`,
    `&b\'ven\' &3me hago tp a tí`,
    `&b\'reconectate\' &3me desconecto y al rato vuelvo`,
    `&b\'vaciate\' &3me vacio el inventario`,
    `&b\'vete\' &3me voy a mi casita`,
    `&b\'dios on/off\' &3me activo/desactivo el modo dios`,
    `&b\'ataca on/off\' &3activo/desactivo el kill aura`,
    `&b\'mina on/off\' &3activo/desactivo el autominado`,
    `&b\'sigueme on/off\' &3activo/desactivo el pathfinding`,
    `&b\'debug on/off\' &3activo/desactivo el modo debug`
];

const delay_between_attacks = 350;
const delay_between_dig = 100;
const max_distance_for_attack = 5;
const max_distance_for_dig = 4;
const dig_error_quit_message = 'Me reconecto ahora, hay un bug que no me permite dejar de picar, tengo que desconectarme';


class Bot_{
    constructor(username, ip, port, authme_password){
        this.options = {
            host: ip, // minecraft server ip
            username: username, // username or email, switch if you want to change accounts
            auth: 'offline', // for offline mode servers, you can set this to 'offline'
            port: port,                // only set if you need a port that isn't 25565
            // version: false,             // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
            // password: '12345678'        // set if you want to use password-based auth (may be unreliable). If specified, the `username` must be an email
          }
        this.authme_password = authme_password
        this.ataca = false;
        this.isDigging = false;
        this.debug = false;
        this.bot = mineflayer.createBot(this.options)
        this.bindevents();
    }

    async bindevents(){
          this.bot.loadPlugin(pathfinder)

          this.bot.on('whisper', (username, message) => {
            if (message === `ayuda`){
                for (const msg of help_message_array) {
                    this.bot.chat(`/tell ${username} ${msg}`);
                  }
            }
            else if (message === `ven`) return this.bot.chat(`/tp ${username}`)
            else if (message === `dios on`){
                this.bot.chat(`/god on`);
                this.bot.chat(`/tell ${username} &3Modo dios activado`);
            }
            else if (message === `dios off`){
                this.bot.chat(`/god off`);
                this.bot.chat(`/tell ${username} &3Modo dios desactivado`);
            }
            else if (message === `ataca on`){
                this.ataca = true;
                this.bot.chat(`/tell ${username} &3Killaura activado`);
                this.killaura(username);
            }
            else if (message === `ataca off`){
                this.ataca = false;
                this.bot.chat(`/tell ${username} &3Killaura desactivado`);
            }
            else if (message === `mina on`){
                this.isDigging = true;
                this.bot.chat(`/tell ${username} &3Auto minado activado`);
                this.dig(username);
            }
            else if (message === `mina off`){
                this.isDigging = false;
                this.bot.chat(`/tell ${username} &3Auto minado desactivado`);
            }
            else if (message === `debug on`){
                this.debug = true;
                this.bot.chat(`/tell ${username} &3Modo debug activado`);
            }
            else if (message === `debug off`){
                this.debug = false;
                this.bot.chat(`/tell ${username} &3Modo debug desactivado`);
            }
            else if (message === `reconectate`){
                this.bot.chat(`Ahora me vuelvo a conectar!`);
                this.bot.quit();
            }
            else if (message === `vete`){
                this.bot.chat(`/tell ${username} &3Un besito en el pito wapo`);
                this.bot.chat(`/home home`);
            }
            else if (message === `vaciate`){
                this.bot.chat(`/tell ${username} &3Aquí tienes mi mierda`);
                
                this.tossNext()
            }
            else if (message === `sigueme on`){
                this.bot.chat(`/tell ${username} &3Voy a por ese culo de warra`);
                this.followPlayer(username);
            }
            else if (message === `sigueme off`){
                this.bot.chat(`/tell ${username} &3Que te den, me voy a Madrid`);
                this.bot.pathfinder.stop();
            }
            else {
                console.log(`(${this.prefix}-chat) ${username}: ${message}`);
            }
          })
        
        this.bot.on('login', () => {
           this.bot.chat(`/login ${this.authme_password}`);
        });

    }

    

    nearestEntity(type) {
        let id
        let entity
        let dist
        let best = null
        let bestDistance = null
        for (id in this.bot.entities) {
          entity = this.bot.entities[id]
          if (type && entity.type !== type) continue
          if (entity === this.bot.entity) continue
          dist = this.bot.entity.position.distanceTo(entity.position)
          if (!best || dist < bestDistance) {
            best = entity
            bestDistance = dist
          }
        }
        return best
      }

    async killaura(username){
        var intervalo = setInterval(() => {
                        try{
                            var mob = this.nearestEntity()
                    
                            if (!mob || !this.ataca) clearInterval(intervalo);
                    
                            const pos = mob.position;
                            this.bot.lookAt(pos, true);
                            if (this.debug) this.bot.chat(`/tell ${username} &3is mob valid? ${mob.isValid}. Distancia al mob ${this.bot.entity.position.distanceTo(pos)}. Entity type ${mob.type}`);
                            if (mob.isValid && this.bot.entity.position.distanceTo(pos) < max_distance_for_attack && mob.type!='other'){
                                this.bot.attack(mob);
                            }
                        }catch(error) {
                            console.log("Killaura error: " + error);
                            clearInterval(intervalo);
                            return false;
                        }}, delay_between_attacks);
    }
    async dig(username) {
        var intervalo = setInterval(async () => {
            try{
                let target
                if (this.bot.targetDigBlock) {
                    if (this.debug) this.bot.chat(`/tell ${username} &3already digging &b${this.bot.targetDigBlock.name}`)
                } else {
                target = this.bot.blockAtCursor(max_distance_for_dig);
                if (target && this.bot.canDigBlock(target)) {
                    if (this.debug) this.bot.chat(`/tell ${username} &3starting to dig &b${target.name}`)
                    try {
                    await this.bot.dig(target)
                    if (this.debug) this.bot.chat(`/tell ${username} &3finished digging &b${target.name}`)
                    } catch (err) {
                    console.log(err.stack)
                    }
                } else {
                    if (this.debug) this.bot.chat('/tell ${username} &3cannot dig')
                    clearInterval(intervalo)
                }
                }if (!this.isDigging){
                    clearInterval(intervalo);
                    this.bot.chat(dig_error_quit_message)
                    this.bot.quit();
                }
            }catch(error) {
                console.log("Automine error: " + error);
                clearInterval(intervalo);
                this.bot.targetDigBlock = null;
                return false;
            }}, delay_between_dig)
    }

    async followPlayer(username) {
        const playerCI = this.bot.players[username]
    
        if (!playerCI || !playerCI.entity) {
            this.bot.chat("I can't see CI!")
            return
        }
    
        const mcData = require('minecraft-data')(this.bot.version)
        const movements = new Movements(this.bot, mcData)
        movements.scafoldingBlocks = []
    
        this.bot.pathfinder.setMovements(movements)
    
        const goal = new GoalFollow(playerCI.entity, 1)
        this.bot.pathfinder.setGoal(goal, true)
    }

    async tossNext () {
        var inventoryItemCount = this.bot.inventory.items().length;
        if (inventoryItemCount === 0) return;

        while (inventoryItemCount > 0) {
        const item = this.bot.inventory.items()[0];
        await this.bot.tossStack(item);
        inventoryItemCount--;
        }
      }
}


module.exports.Bot_ = Bot_;
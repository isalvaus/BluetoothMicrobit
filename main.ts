//Activamos el servicio uart y el media remote

bluetooth.startUartService()
serial.redirectToUSB()

//Periodo del PWM
pins.P0.analogWrite(0)
pins.P0.analogSetPeriod(100)

let command: String
let temp: Number
let brillo: number


basic.forever(()=>{
    let pot = pins.P1.analogRead()
    serial.writeValue("POT", pot)
    pins.P0.analogWrite(pot)
})

//Coprueba la temperatura y activa/ desactiva la calefaccion en caso contrario
loops.everyInterval(1500, function () {
    if (temp < input.temperature() && !pins.P6.digitalRead()) {
        pins.P6.digitalWrite(true)
    } else if (temp >= input.temperature() && pins.P6.digitalRead()) {
        pins.P6.digitalWrite(false)
    }
})






//Leemos los comandos del puerto serie y los ejeccutamos
bluetooth.onUartDataReceived(serial.NEW_LINE, () => {

    let command = bluetooth.uartReadUntil(bluetooth.NEW_LINE).split(" ")
    let cmd = command.shift().toUpperCase()

    try {
        switch (cmd) {
            case "LUZ":
                let brightness = command.shift()
                let brillo = parseInt(brightness)
                    pins.P0.analogWrite((brillo) * 1023 / 100)

                serial.writeLine(brillo.toString())
                break

            case "LOCK":
                let position = command.shift().toUpperCase()
                switch (position) {
                    case
                        "ON":
                        pins.P5.digitalWrite(true)
                        break
                    case
                        "OFF":
                        pins.P5.digitalWrite(false)
                        break
                }

                break

            case "TEMP":
                temp = parseInt(command.shift())
                break

            default:
                serial.writeLine("Commando erroneo")

        }
    }
    catch (error) {
        serial.writeLine(error)
    }

})

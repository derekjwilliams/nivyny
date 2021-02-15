'use strict';
const fs = require('fs')
const { exec } = require("child_process");
function showValues(keyVaultName) {
    exec(`az keyvault secret list --vault-name "${keyVaultName}" > ${keyVaultName}.json`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`)
            return
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`)
            return
        }
        const rawdata = fs.readFileSync(`${keyVaultName}.json`)
        const keyvault = JSON.parse(rawdata)
        const names = keyvault.map(v => v.name)
        names.forEach(n => {
            exec(`az keyvault secret show --name "${n}" --vault-name "${keyVaultName}" --query "value"`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`)
                    return
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`)
                    return
                }
                console.log(`{${n}:${stdout}}\n`)
            })
        })
    })
}
console.log("------ Development  ------")
showValues("your key vault name here");
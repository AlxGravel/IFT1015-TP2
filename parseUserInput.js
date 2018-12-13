function parseUserInput(input) {

    return input.replace(/</g,"&l").replace(/>/g,"&g").replace(/"/,"&u");

}

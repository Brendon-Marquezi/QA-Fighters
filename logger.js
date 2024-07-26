const { createLogger, format, transports } = require('winston');
const path = require('path');

// Define o formato do log
const logFormat = format.printf(({ level, message, timestamp, label }) => {
    const fileName = path.basename(label); //Captura o ultimo nome do caminho
    
    return `${timestamp} [${fileName}] ${level}: ${message}`;
});


// Cria o logger 
const logger = (className) => createLogger({
    format: format.combine(
        format.label({ label: className  }), 
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.colorize(),
        logFormat
    ),
    transports: [
        new transports.Console({ level: 'debug' }),
        new transports.File({ filename: 'logsInfo.log', level: 'info'}),
        new transports.File({ filename: 'logsError.log', level: 'error' }),
        
    ]
});

module.exports = logger;


//Information about Winston - Level the message log (Take this out of here and put it in the documentation)

/*
logger.error('Mensagem de erro');      // Mensagem de erro
logger.warn('Mensagem de aviso');      // Mensagem de aviso
logger.info('Mensagem de informação'); // Mensagem de informação
logger.http('Mensagem de http');       // Mensagem de http
logger.verbose('Mensagem detalhada');  // Mensagem detalhada
logger.debug('Mensagem de depuração'); // Mensagem de depuração
logger.silly('Mensagem trivial');      // Mensagem trivial

 */


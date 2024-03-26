const xlsx = require('xlsx');
const multipart = require('lambda-multipart-parser');

const allowedOrigins = [
  "http://localhost:[0-9]*"
];

exports.handler = async (event) => {
  const origin = event.headers.Origin || event.headers.origin;
  let goodOrigin = false;

  if (origin) {
    allowedOrigins.forEach(allowedOrigin => {
      if (origin.match(allowedOrigin) && !goodOrigin) {
        goodOrigin = true
      }
    });
  }

  if (!goodOrigin) {
    throw new Error('Invalid Origin');
  }

  try {
    const { files } = await multipart.parse(event);

    if (!files || !Array.isArray(files)) {
      throw new Error('No files found in the request');
    }

    const fileSheetMap = [];

    for (const file of files) {
      console.log(file)
      const workbook = xlsx.read(file, { type: 'buffer' });
      const fileSheetNames = workbook.SheetNames;
      const fileName = file.filename;

      const fileObj = {
        fileName: fileName,
        sheets: fileSheetNames
      };

      fileSheetMap.push(fileObj);
    }

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": goodOrigin ? origin : allowedOrigins[0],
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify({
        message: 'Sheet name extracted sucessfully',
        data: fileSheetMap,
        code: 200
      }),
    };

    return response
  } catch (err) {
    console.log("Error extracting sheet names: ", err);

    const response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": goodOrigin ? origin : allowedOrigins[0],
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify({
        message: 'Sheet Name not extracted',
        err: err.message,
        code: 400
      }),
    };

    return response
  }
};

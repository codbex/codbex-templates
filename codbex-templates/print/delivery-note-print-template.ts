import { database } from "sdk/db";
import { response } from "sdk/http";

const DELIVERY_NOTE_ID = 24;

response.setContentType("text/html");

let connection = database.getConnection("DefaultDB");
try {
    let statement = connection.prepareStatement(`SELECT * FROM "CODBEX_DOCUMENTTEMPLATE" WHERE "DOCUMENTTEMPLATE_TYPE" = ${DELIVERY_NOTE_ID}`);
    let resultSet = statement.executeQuery();
    while (resultSet.next()) {
        response.println(resultSet.getClob("DOCUMENTTEMPLATE_CONTENT"));
    }
    resultSet.close();
    statement.close();
} catch (e) {
    if (e instanceof Error) {
        console.error(e);
        response.println(e.message);
    } else {
        console.error("Something went wrong", e);
    }
} finally {
    connection.close();
}
response.flush();
response.close();
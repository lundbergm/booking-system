CREATE TABLE [messages] (
    [id] INTEGER PRIMARY KEY AUTOINCREMENT,
    [guestId] INTEGER NOT NULL,
    [propertyManagerId] INTEGER NOT NULL,
    [sentBy] TEXT NOT NULL,
    [body] TEXT NOT NULL,
    FOREIGN KEY(guestId) REFERENCES guests(id)
);

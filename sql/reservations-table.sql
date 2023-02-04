CREATE TABLE [reservations] (
    [id] INTEGER PRIMARY KEY AUTOINCREMENT,
    [startDate] text NOT NULL,
    [endDate] text NOT NULL,
    [propertyId] INTEGER NOT NULL,
    [guestId] INTEGER NOT NULL,
    [status] text NOT NULL,
    FOREIGN KEY(guestId) REFERENCES guests(id),
    FOREIGN KEY(propertyId) REFERENCES properties(id)
);
CREATE INDEX propertyIdIdx ON reservations (propertyId);
CREATE INDEX guestIdIdx ON reservations (guestId);


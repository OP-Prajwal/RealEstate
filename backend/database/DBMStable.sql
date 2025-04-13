create table Client(
id SERIAL primary key,
name varchar(50),
email varchar(100) UNIQUE,
phone varchar(100),
budget int,
password varchar(200)
)

create table Agent(
id serial primary key,
name varchar(50),
email varchar(100),
phone varchar(100),
total_sales int,
password varchar(200)
)

create table property(
id serial primary key,
title varchar(255),
location varchar(255),
price float not null,
type varchar(100) not null,
bedroom int,
bathroom int,
amenities text,
agent_id int,
status varchar(100) default 'pending',
foreign key (agent_id) references Agent(id)
)


create table contract(
contractId serial primary key,
contract_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
contract_value float,
status varchar(100),
property_id int,
client_id int,
agent_id int,
foreign key (agent_id) references Agent(id),
foreign key (client_id) references Client(id),
foreign key (property_id) references property(id)
)

create table enquiry(
client_id int,
agent_id int,
property_id int,
contract_id int,
foreign key (client_id) references Client(id),
foreign key (agent_id) references Agent(id),
foreign key (property_id) references property(id),
foreign key (contract_id) references contract(contract_id)
) 

select * from property 

alter table property rename bathrom to bathroom;
alter table contract rename contract_id to contractId;
ALTER TABLE contract
ALTER COLUMN contract_date TYPE TIMESTAMP,
ALTER COLUMN contract_date SET DEFAULT CURRENT_TIMESTAMP;

select * from property where location ilike 'bangalore'
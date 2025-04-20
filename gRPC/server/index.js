const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "./customers.proto";

const customers = [
  { id: "1", name: "John Doe", address: "123 Main St", age: 30 },
  { id: "2", name: "Jane Smith", address: "456 Elm St", age: 25 },
  { id: "3", name: "Alice Johnson", address: "789 Oak St", age: 35 },
  { id: "4", name: "Bob Brown", address: "101 Pine St", age: 40 },
];

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const customersProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(customersProto.CustomerService.service, {
  getAllCustomers: (call, callback) => {
    callback(null, { customers });
  },
  getCustomerById: (call, callback) => {
    const customer = customers.find((c) => c.id === call.request.id);
    if (customer) {
      callback(null, customer);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Customer not found",
      });
    }
  },
  InsertCustomer: (call, callback) => {
    const newCustomer = call.request;
    newCustomer.id = String(customers.length + 1); // Simple ID generation
    customers.push(newCustomer);
    callback(null, newCustomer);
  },
  UpdateCustomer: (call, callback) => {
    const updatedCustomer = call.request;
    const index = customers.findIndex((c) => c.id === updatedCustomer.id);
    if (index !== -1) {
      customers[index].name = updatedCustomer.name;
      customers[index].address = updatedCustomer.address;
      callback(null, customers[index]);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Customer not found",
      });
    }
  },
  DeleteCustomer: (call, callback) => {
    const index = customers.findIndex((c) => c.id === call.request.id);
    if (index !== -1) {
      customers.splice(index, 1);
      callback(null, { success: true });
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: "Customer not found",
      });
    }
  },
});

server.bindAsync(
  "127.0.0.1:30043",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(err);
      return;
    }
    server.start();
    console.log(`Server running at ${port}`);
  }
);

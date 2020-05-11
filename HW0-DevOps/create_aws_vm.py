import boto3
import sys

def create_instance():
    ec2 = boto3.resource('ec2')
    # create a new EC2 instance
    resp = ec2.create_instances( ImageId='ami-04b9e92b5572fa0d1', MinCount=1, MaxCount=1, InstanceType='t2.micro', KeyName='ec2-KP-devops')
    print(resp)
    resp = resp[0]
    resp.wait_until_running()
    resp.load()
    print(resp.public_ip_address)
    
def create_kp():
    ec2 = boto3.resource('ec2')

    # create a file to store the key locally
    outfile = open('ec2-KP-devops.pem','w')

    # call the boto ec2 function to create a key pair
    key_pair = ec2.create_key_pair(KeyName='ec2-KP-devops')

    # capture the key and store it in a file
    KeyPairOut = str(key_pair.key_material)
    print(KeyPairOut)
    outfile.write(KeyPairOut)

if __name__== "__main__" :
    if sys.argv[1] == 'create_vm':
        create_instance()
    if sys.argv[1] == 'create_kp':
        create_kp()


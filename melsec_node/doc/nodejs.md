### NodeJS
- 이벤트 
- C#, JavaScrpit 및 Python F#와 같은 여러 프로그래밍 언어를 복잡한 프로세스 간 통신이나 데이터의 직렬화 없이 언어간 통신 할 수 있음.
![image](/doc/img/edgejs.png)
- 예제 (MxComponent의 ActProgType64Lib.dll)
- C#
``` csharp
  namespace MiMXComponentWrapper
  {
    public class ProgTypePLCManager
    {
        static Dictionary<string, ProgTypePLC> ProgTypePLCMap = new Dictionary<string, ProgTypePLC>();

        public async Task<object> AddInstance(dynamic input) // 이벤트 방식 이기 때문 Task 를 사용한 Background 동작
        {
            string str = (string)input.str;
            string IP = (string)input.ip;
            int Port = (int)input.port;
            string Password = (string)input.password;
            ProgTypePLC utlytypeplc = new ProgTypePLC(IP, Port, Password, input.type);
            ProgTypePLCMap.Add(str, utlytypeplc);
            return true;
        }

        public async Task<object> Connect(dynamic input) // 이벤트 방식 이기 때문 Task 를 사용한 Background 동작
        {
            string str = (string)input.str;
            UtlTypePLC utlytypeplc = UtlTypePLCMap[str.ToString()];
            return utlytypeplc.Connect();
        }
    }

    public class ProgTypePLC
    {
        private ActProgType64Lib.ActProgType64 actProgType;
        public ProgTypePLC(string ip,int port, string password, dynamic input)
        {
            actProgType = new ActProgType64Lib.ActProgType64();
            // If not use the default value of the property, 
            // Set a suitable value before the Open wethod.
            // ( Even if set after the Open method, not reflected in the communication. )
            // ---> e.g., Change the 'UnitType' to RUSB, the 'ProtocolType' to USB, and the 'CpuType' to R08CPU. 
            actProgType.ActHostAddress = ip;
            actProgType.ActPortNumber = port;
            actProgType.ActPassword = password;

            actProgType.ActUnitType = input.ActUnitType;       // UNIT_QNETHER(44), UNIT_QNETHER_DIRECT(45)
            actProgType.ActProtocolType = input.ActProtocolType;     // PROTOCOL_USB(13) PROTOCOL_TCPIP(5) PROTOCOL_UDPIP(8)
            actProgType.ActCpuType = input.ActCpuType;        // CPU_Q04UDVCPU(210)

            // Other propety is set a default value.
            actProgType.ActBaudRate = input.ActBaudRate;
            actProgType.ActConnectUnitNumber = input.ActConnectUnitNumber;
            actProgType.ActControl = input.ActConnectUnitNumber;
            actProgType.ActCpuTimeOut = input.ActCpuTimeOut;
            actProgType.ActDataBits = input.ActDataBits;
            actProgType.ActDestinationIONumber = input.ActDestinationIONumber;
            actProgType.ActDestinationPortNumber = input.ActDestinationPortNumber;
            actProgType.ActDidPropertyBit = input.ActDidPropertyBit;
            actProgType.ActDsidPropertyBit = input.ActDsidPropertyBit;
            
            actProgType.ActIntelligentPreferenceBit = input.ActIntelligentPreferenceBit;
            actProgType.ActIONumber = input.ActIONumber;
            actProgType.ActMultiDropChannelNumber = input.ActMultiDropChannelNumber;
            actProgType.ActNetworkNumber = input.ActNetworkNumber;
            actProgType.ActPacketType = input.ActPacketType;
            actProgType.ActParity = input.ActParity;
            actProgType.ActSourceNetworkNumber = input.ActSourceNetworkNumber;
            actProgType.ActSourceStationNumber = input.ActSourceStationNumber;
            actProgType.ActStationNumber = input.ActStationNumber;
            actProgType.ActStopBits = input.ActStopBits;
            actProgType.ActSumCheck = input.ActSumCheck;
            actProgType.ActTargetSimulator = input.ActTargetSimulator;
            actProgType.ActThroughNetworkType = input.ActThroughNetworkType;
            actProgType.ActTimeOut = input.ActTimeOut;
            actProgType.ActUnitNumber = input.ActUnitNumber;
        }

        public int Connect()
        {
            return actProgType.Open();
        }
    }
  }
```
- Node.js
``` javascript
// progInit 함수에 C# AddInstance 함수 바인딩
const progInit = edge.func({
    assemblyFile: assemblyFilePath, // DLL 파일 경로
    typeName: ProgTypePLCManager, // ClassName
    methodName: 'AddInstance', // 함수이름
});

// progInit 함수에 C# AddInstance 함수 바인딩
const progConnect = edge.func({
    assemblyFile: assemblyFilePath, // DLL 파일 경로
    typeName: ProgTypePLCManager, // ClassName
    methodName: 'Connect', // 함수이름
});

// progInit 바인딩 한 함수 호출
progInit({str:this.uuid, ip:this.ip, port:this.port, password:this.password, type:this.type}, (err, result) => {
    if(err)  // DLL 링크 에러
    if(result === true) {
        // Init 완료
    }
    else {
        // Init 실패
    }
})
// progConnect 바인딩 한 함수 호출
progConnect({str:this.uuid}, (err, result) => {
    if(err) // DLL 링크 에러
    
    if(result === 0) {
        // 연결완료
    }
    else {
        // 연결실패
    }      
 });
```

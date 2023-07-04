## ActProgType과 ActUtlType의 차이점
### ActProgType
- ActProgType은 사용자가 Programable 하다
- ip,port, timeout 등... 사용자가 지정가능하다.
``` csharp
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
```
### ActUtlType
- MxComponent의 (Communication Setting Utility)을 이용하여 설정이후 스테이션번호를 등록하면 Station 번호를 통하여 접근 가능
![image](/doc/img/actutltype.PNG)
![image](/doc/img/actutltype2.PNG)

### ActProgType의 사용
- ActUtlType을 사용시에 MxComponent의 (Communication Setting Utility) 사용하여 설정 정보를 등록해야함.
- MxComponent의 (Communication Setting Utility)를 사용하지 않고 ActProgType를 사용, **확장성 고려**

### MELSCT PLC 메모리
#### 입력 X
- PLC 입력 유닛에 연결된 입력장치(스위치,센서)
- ON/OFF 데이터를 저장하는 디바이스
#### 출력 Y
- PLC 출력 유닛에 연결된 출력 장치(모터,램프,솔레노이드)
- ON/OFF 데이터를 저장하는 출력 디바이스
#### 내부릴레이 M, L, S B, F
- CPU 외부로 부터 직접 출력 할 수 없는 PLC 내부 보조 릴레이
- CPU ON/OFF 접점 데이터를 저장하는 비트 디바이스
#### 타이머 T
- ON Delay 타이머
#### 카운터 C
- 기본프로그램에서 사용하는 UP-Counter
#### 데이터 레지스터 D
- CPU 내에 데이터를 저장하는 디바이스
- 16비트 또는 32비트 단위로 저장
#### 링크 레지스터 W
- 네트워크 통신 및 리모트 통신시 CPU간 상호 워드 데이터 공유
- 네트워크 사용 하지 않을 시 D영역과 동일하게 사용
#### 파일 레지스터 R
- CPU의 D,W 저장 공간이 부족할 경우 사용
- 파일 레지스터 사용 범위를 설정 가능
- 파일 레지스터 1Point당 2Byte 차지
#### 어큐뮬레이터 A
- 기본 명령 또는 응용 명령(ROR, SUM, SER등)의 연산 결과를 저장하는 임시 워드 저장 영역
#### 인덱스 레지스터 Z,V
- 디바이스 수식용으로 사용하는 데이터 레지스터
#### 네스팅 N
- MC, MCR의 Master Control 명령을 사용 할 경우 영역을 지정하는 디바이스
#### 포인터 P
- 분기명령(CJ, SCJ, CALL, JMP)의 분기점을 지정하는 디바이스
#### 인터럽트용 포인트 I
- 인터럽터 요인이 발생할 경우 요인에 대응하는 프로그램으로 분기하는 곳을 지정하는 디바이스
![image](/doc/img/Memoryarch.PNG)



### 프로그래밍 시 주의 사항
- Open 함수는 통신 경로의 확립, PLC 내부 정보의 수집 등을 처리하기 위해 처리시간이 길어지는 경우가 있습니다.
- 사용자의 애플리케이션 속도를 향상 시키기 위해 효율적인 프로그램을 작성 할 필요가 있습니다.
![image](/doc/img/plc.PNG)

### LONG형 함수와 SHORT 형/ INT 형 함수의 차이
- 디바이스 일괄 읽기, 디바이스 일괄쓰기, 디바이스 랜덤 읽기, 디바이스 랜덤 쓰기, 디바이스 데이터설정, 디바이스 데이터수집을 실행하기 위한 함수로 LONG형 함수와 SHORT/INT형 함수의 2종류를 구비하고 있음.
- LONG형 함수 : ReadDeviceBlock, WriteDeviceBlock, ReadDeviceRandom, WriteDeviceRandom, SetDevice, GetDevice
- SHORT/INT형 함수 : ReadDeviceBlock2, WriteDeviceBlock2, ReadDeviceRandom2, WriteDeviceRandom2, SetDevice2, GetDevice2
- **음수값을 읽는경우 SHORT/INT함수를 사용할것**

### 함수
- Open - 통신 회선 오픈
- Close - 통신 회선 클로즈
- ReadDeviceBlock - 디바이스 일괄 읽기
- WriteDeviceBlock - 디바이스 일괄 쓰기
- ReadDeviceRandom - 디바이스 랜덤 읽기
- WriteDeviceRandom - 디바이스 랜덤 쓰기
- SetDevice - 디바이스 데이터 설정
- GetDevice - 디바이스 데이터 읽기
- ReadBuffer - 버퍼 메모리 읽기
- WriteBuffer - 버퍼 메로리 쓰기
- GetClockData - 시계 데이터 읽기
- SetClockData - 시계 데이터 쓰기
- GetCpuType - CPU 형명 읽기
- SetCpuStatus - 리모드 컨트롤
- EntryDeviceStatus - 디바이스 상태 감시 등록
- FreeDeviceStatus - 디바이스 상태 감시 등록 해제
- OnDeviceStatus - 이벤트 고지 (EntryDeviceStatus 함수에 등록되어 있는 디바이스 조건 성립 시 실행합니다.)
- ReadDeviceBlock2 - 디바이스 일괄 읽기
- WriteDeviceBlock2 - 디바이스 일괄 쓰기
- ReadDeviceRandom2 - 디바이스 랜덤 읽기
- WriteDeviceRandom2 - 디바이스 랜덤 쓰기
- SetDevice2 - 디바이스 데이터 설정
- GetDevice2 - 디바이스 데이터 읽기
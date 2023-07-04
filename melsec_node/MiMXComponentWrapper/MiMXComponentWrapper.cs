using ActUtlType64Lib;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Xml.Linq;
using static MiMXComponentWrapper.UtlTypePLCManager;

namespace MiMXComponentWrapper
{

    public class ProgTypePLCManager
    {
        static Dictionary<string, ProgTypePLC> ProgTypePLCMap = new Dictionary<string, ProgTypePLC>();

        public async Task<object> AddInstance(dynamic input)
        {
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();
            try
            {
                string IP = (string)input.ip;
                int Port = (int)input.port;
                string Password = (string)input.password;
                if (ProgTypePLCMap.ContainsKey(input.str))
                {
                    ProgTypePLCMap.Remove(input.str);
                }

                ProgTypePLC utlytypeplc = new ProgTypePLC(IP, Port, Password, input.type);
                ProgTypePLCMap.Add(input.str, utlytypeplc);
                dynamicOutput.returnCode = String.Format("0x{0:x8}", 0);
            } catch (Exception e)
            {
                dynamicOutput.error = e;
            }
            return dynamicOutput;
        }

        public async Task<object> DelInstance(dynamic input)
        {
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();
            
            try
            {
                ProgTypePLCMap.Remove(input.str);
                dynamicOutput.returnCode = String.Format("0x{0:x8}", 0);
            }
            catch (Exception e)
            {
                dynamicOutput.error = e;
            }
            return dynamicOutput;
        }

        public async Task<object> Connect(dynamic input)
        {
            string str = (string)input.str;
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();
            
            if(!ProgTypePLCMap.ContainsKey(str))
               return dynamicOutput.error = str+"라는 Key는 없습니다.";

            try
            {
                ProgTypePLC utlytypeplc = ProgTypePLCMap[input.str];
                return utlytypeplc.Connect();
            }
            catch (Exception ex)
            {
                return dynamicOutput.error = ex.Message;

            }
        }

        public async Task<object> Disconnect(dynamic input)
        {
            string str = (string)input.str;
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();

            if (!ProgTypePLCMap.ContainsKey(str))
                return dynamicOutput.error = str + "라는 Key는 없습니다.";

            try
            {
                ProgTypePLC utlytypeplc = ProgTypePLCMap[input.str];
                return utlytypeplc.Disconnect();
            }
            catch (Exception ex)
            {
                return dynamicOutput.error = ex.Message;

            }
        }

        public async Task<object> GetCpuType(dynamic input)
        {
            string str = (string)input.str;
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();

            if (!ProgTypePLCMap.ContainsKey(str))
                return dynamicOutput.error = str + "라는 Key는 없습니다.";

            try
            {
                ProgTypePLC utlytypeplc = ProgTypePLCMap[input.str];
                return utlytypeplc.GetCpuType();
            }
            catch (Exception ex)
            {
                return dynamicOutput.error = ex.Message;
            }
        }

        public async Task<object> ReadDeviceBlock(dynamic input)
        {
            string str = (string)input.str;
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();

            if (!ProgTypePLCMap.ContainsKey(str))
                return dynamicOutput.error = str + "라는 Key는 없습니다.";

            try
            {
                ProgTypePLC utlytypeplc = ProgTypePLCMap[input.str];
                return utlytypeplc.ReadDeviceBlock((string)input.szDevice, (int)input.size);
            }
            catch (Exception ex)
            {
                return dynamicOutput.error = ex.Message;
            }
        }

        public async Task<object> WriteDeviceBlock(dynamic input)
        {
            string str = (string)input.str;
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();

            if (!ProgTypePLCMap.ContainsKey(str))
                return dynamicOutput.error = str + "라는 Key는 없습니다.";

            try
            {
                ProgTypePLC utlytypeplc = ProgTypePLCMap[input.str];
                return utlytypeplc.WriteDeviceBlock(input.szDevice, input.data);
            }
            catch (Exception ex)
            {
                return dynamicOutput.error = ex.Message;
            }
        }

        public async Task<object> GetDevice(dynamic input)
        {
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();

            if (!ProgTypePLCMap.ContainsKey(input.str))
                return dynamicOutput.error = input.str + "라는 Key는 없습니다.";

            
            try
            {
                ProgTypePLC utlytypeplc = ProgTypePLCMap[input.str];
                return utlytypeplc.GetDevice(input.szDevice);
            }
            catch (Exception ex)
            {
                return dynamicOutput.error = ex.Message;
            }
        }

        public async Task<object> SetDevice(dynamic input)
        {
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();

            if (!ProgTypePLCMap.ContainsKey(input.str))
                return dynamicOutput.error = input.str + "라는 Key는 없습니다.";

            try {
                ProgTypePLC utlytypeplc = ProgTypePLCMap[input.str];
                return utlytypeplc.SetDevice((string)input.szDevice, (short)input.data);
            } catch(Exception ex)
            {
                return dynamicOutput.error = ex.Message;
            }
            
        }

        public async Task<object> ReadBuffer(dynamic input)
        {
            string str = (string)input.str;
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();

            if (!ProgTypePLCMap.ContainsKey(str))
                return dynamicOutput.error = str + "라는 Key는 없습니다.";

            ProgTypePLC utlytypeplc = ProgTypePLCMap[str.ToString()];
            return utlytypeplc.ReadBuffer(input.startIO, input.addr, input.size);
        }

        public async Task<object> WriteBuffer(dynamic input)
        {
            string str = (string)input.str;
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();

            if (!ProgTypePLCMap.ContainsKey(str))
                return dynamicOutput.error = str + "라는 Key는 없습니다.";

            ProgTypePLC utlytypeplc = ProgTypePLCMap[str.ToString()];
            return utlytypeplc.WriteBuffer(input.startIO, input.addr, input.size, input.data);
        }

        public async Task<object> CheckControl(dynamic input)
        {
            string str = (string)input.str;
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();

            if (!ProgTypePLCMap.ContainsKey(str))
                return dynamicOutput.error = str + "라는 Key는 없습니다.";

            ProgTypePLC utlytypeplc = ProgTypePLCMap[str.ToString()];

            return utlytypeplc.CheckControl();
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

        public dynamic Connect()
        {
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();
            int iReturnCode;		// Return code
            iReturnCode = actProgType.Open();
            dynamicOutput.returnCode = String.Format("0x{0:x8}", iReturnCode);
            return dynamicOutput;
        }

        public dynamic Disconnect()
        {
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();
            int iReturnCode = actProgType.Close();
            dynamicOutput.returnCode = String.Format("0x{0:x8}", iReturnCode);
            return dynamicOutput;
        }

        public dynamic GetCpuType()
        {
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();
            string CpuType;
            int CpuCode;
            int iReturnCode = actProgType.GetCpuType(out CpuType, out CpuCode);

            dynamicOutput.returnCode = String.Format("0x{0:x8}", iReturnCode);
            dynamicOutput.CpuType = CpuType;
            dynamicOutput.CpuCode = CpuCode;
            return dynamicOutput;
        }

        public dynamic ReadDeviceBlock(string szDevice, int iNumberOfData)
        {
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();
            int iReturnCode;
            short[] arrDeviceValue;

            arrDeviceValue = new short[iNumberOfData];
            iReturnCode = actProgType.ReadDeviceBlock2(szDevice, iNumberOfData, out arrDeviceValue[0]);
            dynamicOutput.returnCode = String.Format("0x{0:x8}", iReturnCode);

            string stringdata = "";
            for (int i = 0; i < iNumberOfData; i++)
            {
                byte[] bytes = BitConverter.GetBytes(arrDeviceValue[i]);
                stringdata += Encoding.Default.GetString(bytes);
            }
            dynamicOutput.data = stringdata;
            return dynamicOutput;
        }

        public dynamic WriteDeviceBlock(string szDeviceName, string plData)
        {
            int iReturnCode;		    	// Return code

            string str = plData;
            string[] str_temp;
            short[] sInt;

            if (str.Length % 2 == 0)
            {
                str_temp = new string[str.Length / 2];
                sInt = new short[str_temp.Length];

                for (int i = 0; i < str.Length / 2; i++)
                {
                    str_temp[i] = str.Substring(i * 2, 2);
                }

                for (int i = 0; i < str_temp.Length; i++)
                {
                    byte[] bytes = Encoding.ASCII.GetBytes(str_temp[i]);
                    short sh = BitConverter.ToInt16(bytes, 0);
                    sInt[i] = sh;
                }
            }
            else
            {
                str_temp = new string[(str.Length / 2) + 1];
                sInt = new short[str_temp.Length];

                for (int i = 0; i < str.Length / 2 + 1; i++)
                {
                    if (i < (str.Length - 1) / 2)
                        str_temp[i] = str.Substring(i * 2, 2);
                    else
                        str_temp[i] = str.Substring(i * 2, 1);
                }

                for (int i = 0; i < str_temp.Length; i++)
                {
                    if (i < str_temp.Length - 1)
                    {
                        byte[] bytes = Encoding.ASCII.GetBytes(str_temp[i]);
                        short sh = BitConverter.ToInt16(bytes, 0);
                        sInt[i] = sh;
                    }
                    else
                    {
                        char data = Convert.ToChar(str_temp[i].Substring(0, 1));
                        sInt[i] = (short)data;
                    }
                }
            }

            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();
            iReturnCode = actProgType.WriteDeviceBlock2(szDeviceName, sInt.Length, ref sInt[0]);
            dynamicOutput.returnCode = String.Format("0x{0:x8}", iReturnCode);
            return dynamicOutput;
        }

        public dynamic ReadDeviceRandom(string szDeviceName, int iNumberOfData)
        {
            int iReturnCode;		    // Return code
            int[] arrDeviceValue;           // DeviceData

            arrDeviceValue = new int[iNumberOfData];

            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();

            iReturnCode = actProgType.ReadDeviceRandom(szDeviceName, iNumberOfData, out arrDeviceValue[0]);
            dynamicOutput.returnCode = String.Format("0x{0:x8}", iReturnCode);
            dynamicOutput.data = arrDeviceValue;
            return dynamicOutput;
        }

        public dynamic WriteDeviceRandom(string szDeviceName, int iNumberOfData, dynamic plData)
        {
            int iReturnCode;		// Return code
            int[] arrDeviceValue = (int[])plData;  // Data for 'DeviceData'
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();
            iReturnCode = actProgType.WriteDeviceRandom(szDeviceName, iNumberOfData, ref arrDeviceValue[0]);
            dynamicOutput.returnCode = String.Format("0x{0:x8}", iReturnCode);
            return dynamicOutput;
        }
        public dynamic SetDevice(string szDeviceName, short plData)
        {
            int iReturnCode;		// Return code
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();
            iReturnCode = actProgType.SetDevice2(szDeviceName, plData);
            dynamicOutput.returnCode = String.Format("0x{0:x8}", iReturnCode);
            return dynamicOutput;
        }

        public dynamic GetDevice(string szDeviceName)
        {
            int iReturnCode;		// Return code

            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();
            short data;
            iReturnCode = actProgType.GetDevice2(szDeviceName, out data);

            dynamicOutput.returnCode = String.Format("0x{0:x8}", iReturnCode);
            dynamicOutput.data = data;
            return dynamicOutput;
        }

        public dynamic ReadBuffer(int iIOAddress, int iBufferAddress, int iBufferSize)
        {
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();

            int iReturnCode;		// Return code
            short[] SharrBuf;       // List data for 'BufferData'
            int iNumber;			// Loop counter
            String[] arrData;	    // Array for 'Data'

            SharrBuf = new short[iBufferSize];
            arrData = new String[iBufferSize];

            for (iNumber = 0; iNumber < iBufferSize; iNumber++)
            {
                arrData[iNumber] = SharrBuf[iNumber].ToString();
            }

            iReturnCode = actProgType.ReadBuffer(iIOAddress, iBufferAddress, iBufferSize, out SharrBuf[0]);
            dynamicOutput.returnCode = String.Format("0x{0:x8}", iReturnCode);
            dynamicOutput.data = arrData;
            return dynamicOutput;
        }

        public dynamic WriteBuffer(int iIOAddress, int iBufferAddress, int iBufferSize, dynamic plData)
        {
            int iReturnCode;				// Return code
            short[] SharrBuf;               // List data for 'BufferData'
            SharrBuf = (short[]) plData;
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();

            iReturnCode = actProgType.WriteBuffer(iIOAddress, iBufferAddress, iBufferSize, ref SharrBuf[0]);

            dynamicOutput.returnCode = String.Format("0x{0:x8}", iReturnCode);
            return dynamicOutput;
        }

        public dynamic CheckControl()
        {
            dynamic dynamicOutput = new System.Dynamic.ExpandoObject();
            int iReturnCode;		// Return code
            iReturnCode = actProgType.CheckControl();
            dynamicOutput.returnCode = String.Format("0x{0:x8}", iReturnCode);

            return dynamicOutput;
        }

    }
    public class UtlTypePLCManager
    {

        static Dictionary<string, UtlTypePLC> UtlTypePLCMap = new Dictionary<string, UtlTypePLC>();
        public async Task<object> AddInstance(dynamic input)
        {
            string str = (string)input.str;
            int num = (int)input.num;
            UtlTypePLC utlytypeplc = new UtlTypePLC(num);
            UtlTypePLCMap.Add(str, utlytypeplc);
            return true;
        }

        public async Task<object> DelInstance(dynamic input)
        {
            UtlTypePLCMap.Remove(input.str);
            return true;
        }

        public async Task<object> Connect(dynamic input)
        {
            string str = (string)input.str;

            UtlTypePLC utlytypeplc = UtlTypePLCMap[str.ToString()];
            return utlytypeplc.Connect();
        }

        public async Task<object> Disconnect(dynamic input)
        {
            string str = (string)input.str;

            UtlTypePLC utlytypeplc = UtlTypePLCMap[str.ToString()];
            return utlytypeplc.Disconnect();
        }

        public async Task<object> GetCpuType(dynamic input)
        {
            string str = (string)input.str;

            UtlTypePLC utlytypeplc = UtlTypePLCMap[str.ToString()];
            return utlytypeplc.GetCpuType();
        }

        public async Task<object> ReadDeviceBlock(dynamic input)
        {
            string str = (string)input.str;
            string szDevice = (string)input.szDevice;
            int size = (int)input.size;
            UtlTypePLC utlytypeplc = UtlTypePLCMap[str.ToString()];
            return utlytypeplc.ReadDeviceBlock(szDevice, size);
        }

        public async Task<object> WriteDeviceBlock(dynamic input)
        {
            string str = (string)input.str;
            string szDevice = (string)input.szDevice;
            int size = (int)input.size;
            int data = (int)input.data;
            UtlTypePLC utlytypeplc = UtlTypePLCMap[str.ToString()];
            return utlytypeplc.WriteDeviceBlock(szDevice, size, ref data);
        }

        public class UtlTypePLC
        {

            private ActUtlType64Lib.ActUtlType64 actUtlType;
            private int LogicalStationNumber = 0;

            public UtlTypePLC(int StationNumber)
            {
                actUtlType = new ActUtlType64Lib.ActUtlType64();
                LogicalStationNumber = StationNumber;
                actUtlType.ActLogicalStationNumber = StationNumber;
            }

            public int Connect()
            {
                return actUtlType.Open();
            }

            public int Disconnect()
            {
                return actUtlType.Close();
            }

            public string GetCpuType()
            {
                string CpuType; int CpuCode;
                actUtlType.GetCpuType(out CpuType, out CpuCode);
                return CpuType;
            }

            public int ReadDeviceBlock(string szDevice, int Size)
            {
                int plData;
                actUtlType.ReadDeviceBlock(szDevice, Size, out plData);
                return plData;
            }

            public int WriteDeviceBlock(string szDevice, int Size, ref int plData)
            {
                return actUtlType.WriteDeviceBlock(szDevice, Size, plData); ;
            }

        }
    }
}

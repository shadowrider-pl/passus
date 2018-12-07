package finbarre.service.impl;

import finbarre.domain.PassusLog;

public class ConvertLog {
	
	String status=" [STATUS= CHECKED]";

	public PassusLog addCheckedStatus(PassusLog passusLog) {
		
		boolean isChecked = passusLog.getValue().contains(status);
		if(!isChecked) {
			passusLog.setValue(passusLog.getValue()+status);
		}
		
		return passusLog;
	}

}

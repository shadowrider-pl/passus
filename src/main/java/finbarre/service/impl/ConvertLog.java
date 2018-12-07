package finbarre.service.impl;

import finbarre.domain.PassusLog;

public class ConvertLog {

	String status = " [STATUS= CHECKED]";

	public PassusLog convertStatus(PassusLog passusLog) {

		boolean isChecked = passusLog.getValue().contains(status);
		if (!isChecked) {
			passusLog.setValue(passusLog.getValue() + status);
		} else {
			passusLog.setValue(passusLog.getValue().replace(status, ""));
		}

		return passusLog;
	}

}

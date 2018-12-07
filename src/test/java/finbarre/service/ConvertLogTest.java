package finbarre.service;

import finbarre.domain.PassusLog;
import finbarre.service.impl.ConvertLog;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test class for the PassusLog.
 *
 * 
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ConvertLog.class)
public class ConvertLogTest {


    private static final ZonedDateTime DEFAULT_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);

    private static final String DEFAULT_NAME = "AAAAAAAAAA";

    private static final String DEFAULT_VALUE = "VVVVVVVVVVVV";
    private static final String UPDATED_VALUE = DEFAULT_VALUE+" [STATUS= CHECKED]";


    private PassusLog passusLog;


    /**
     * Create an entity for this test.
     */
    public static PassusLog createEntity() {
        PassusLog passusLog = new PassusLog()
            .time(DEFAULT_TIME)
            .name(DEFAULT_NAME)
            .value(DEFAULT_VALUE);
        return passusLog;
    }


    @Before
    public void initTest() {
        passusLog = createEntity();
    }
    
    @Test
    public void convertStatusTest() throws Exception {
    	ConvertLog convertLog = new ConvertLog();
    	passusLog=convertLog.convertStatus(passusLog);
    assertThat(passusLog.getTime()).isEqualTo(DEFAULT_TIME);
    assertThat(passusLog.getName()).isEqualTo(DEFAULT_NAME);
    assertThat(passusLog.getValue()).isEqualTo(UPDATED_VALUE);
    
    // again
	passusLog=convertLog.convertStatus(passusLog);
    assertThat(passusLog.getTime()).isEqualTo(DEFAULT_TIME);
    assertThat(passusLog.getName()).isEqualTo(DEFAULT_NAME);
    assertThat(passusLog.getValue()).isEqualTo(DEFAULT_VALUE);
    }
    
   
}

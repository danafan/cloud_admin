import { MessageBox,Message } from 'element-ui';

export default{
	exportUp(url){
		MessageBox.confirm('确认导出?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			let url = `${location.origin}/admin/${url}`;
			window.open(url);
		}).catch(() => {
			Message({
				type: 'info',
				message: '取消导出'
			});          
		});
	}
}
